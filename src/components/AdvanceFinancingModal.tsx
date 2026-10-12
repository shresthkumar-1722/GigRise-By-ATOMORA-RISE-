import React, { useState } from 'react';
import { calculateClientAdvanceLoan } from '../backend/api';
import { 
  X, 
  Coins, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Sliders, 
  Calendar, 
  HelpCircle,
  FileCheck
} from 'lucide-react';

interface AdvanceFinancingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoanApproved?: (loanAmount: number) => void;
}

export const AdvanceFinancingModal: React.FC<AdvanceFinancingModalProps> = ({
  isOpen,
  onClose,
  onLoanApproved
}) => {
  if (!isOpen) return null;

  const [amount, setAmount] = useState(800);
  const [tier, setTier] = useState<
    'Grassroots Community' | 'Student & Emerging Artist' | 'Small Family Event' | 'Standard Micro-Business'
  >('Small Family Event');
  const [tenure, setTenure] = useState(4);
  const [isApproved, setIsApproved] = useState(false);

  // Compute live loan breakdown
  const loan = calculateClientAdvanceLoan(amount, tier, tenure);

  const handleApply = () => {
    setIsApproved(true);
    if (onLoanApproved) {
      onLoanApproved(amount);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2c2722]/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-[#faf8f5] rounded-2xl border border-[#c5a880]/50 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col paper-texture"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Paper Header */}
        <div className="p-5 sm:p-6 border-b border-[#ebdcc8] flex items-center justify-between bg-[#f4efe4]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ede2cf] text-[#8c6735] flex items-center justify-center border border-[#d8c7ad]">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#8c8072]">
                Client Financing Facility
              </div>
              <h3 className="text-xl font-serif font-semibold text-[#2c2722]">
                GigRise Micro-Advance Credit
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#ede6da] hover:bg-[#e2d8c9] text-[#5c5245] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {isApproved ? (
            /* Approved State */
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#e8efe8] text-[#4d7350] border border-[#c6dcc7] flex items-center justify-center mx-auto shadow-sm">
                <FileCheck className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-serif font-semibold text-[#2c2722]">
                Micro-Advance Pre-Approved!
              </h4>
              <p className="text-xs sm:text-sm text-[#6f665a] max-w-md mx-auto">
                Your loan limit of <strong className="text-[#2c2722] font-mono">${amount}.00</strong> has been allocated to your Client Wallet. You can immediately use this credit to book artists with zero upfront cash distress.
              </p>

              {/* Certificate Card */}
              <div className="p-4 rounded-xl bg-[#f4efe4] border border-[#d6c9b5] max-w-md mx-auto text-left space-y-2 text-xs">
                <div className="flex justify-between border-b border-[#e2d7c5] pb-2 font-mono text-[11px] text-[#786b5d]">
                  <span>VOUCHER ID: {loan.id}</span>
                  <span>TIER: {tier}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-[#6d6153]">Interest Rate (Fixed Subsidized):</span>
                  <span className="font-bold text-[#4d7350] font-mono">{loan.interestRateAnnual}% APR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6d6153]">Monthly Installment ({tenure} mos):</span>
                  <span className="font-bold text-[#2c2722] font-mono">${loan.monthlyInstallment}/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6d6153]">Total Repayment:</span>
                  <span className="font-bold text-[#2c2722] font-mono">${loan.totalRepayment}</span>
                </div>
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 text-xs font-medium text-[#faf8f5] bg-[#3a352f] hover:bg-[#1f1c19] rounded-lg transition-colors shadow-xs"
                >
                  Apply Credit to Booking
                </button>
              </div>
            </div>
          ) : (
            /* Calculator Form */
            <>
              <p className="text-xs text-[#6e6355] leading-relaxed">
                We believe live art and sacred acoustics should belong to everyone, not just luxury budgets. For clients facing tighter liquidity, GigRise offers subsidized micro-advances with no predatory compound fees.
              </p>

              {/* Tier Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#4e4438] mb-1.5">
                  Select Financial Condition Tier:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { name: 'Grassroots Community', rate: '2.2% APR', desc: 'Non-profits, cultural assemblies' },
                    { name: 'Student & Emerging Artist', rate: '2.6% APR', desc: 'Graduation milestones & youth' },
                    { name: 'Small Family Event', rate: '3.2% APR', desc: 'Intimate anniversaries & weddings' },
                    { name: 'Standard Micro-Business', rate: '3.8% APR', desc: 'Cafés, bookshops, popups' }
                  ].map((t) => (
                    <div
                      key={t.name}
                      onClick={() => setTier(t.name as any)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        tier === t.name
                          ? 'bg-[#f4efe4] border-[#9b784a] shadow-xs'
                          : 'bg-[#faf8f5] border-[#dfd4c0] hover:bg-[#f7f2e8]'
                      }`}
                    >
                      <div className="flex justify-between items-center font-medium text-[#2c2722]">
                        <span className="text-xs">{t.name}</span>
                        <span className="font-mono text-[11px] text-[#4d7350] font-bold">{t.rate}</span>
                      </div>
                      <div className="text-[10px] text-[#7a6f62] mt-0.5">{t.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Loan Amount Slider */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-[#4e4438]">Requested Advance Amount:</span>
                  <span className="font-mono text-base font-bold text-[#2c2722]">${amount}</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="3000"
                  step="50"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full accent-[#9b784a] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#8a7f72] mt-1">
                  <span>$200</span>
                  <span>$1,500</span>
                  <span>$3,000</span>
                </div>
              </div>

              {/* Tenure Selection */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-[#4e4438]">Repayment Tenure (Months):</span>
                  <span className="font-mono text-sm font-bold text-[#2c2722]">{tenure} Months</span>
                </div>
                <div className="flex gap-2">
                  {[2, 3, 4, 6].map((m) => (
                    <button
                      key={m}
                      onClick={() => setTenure(m)}
                      className={`flex-1 py-1.5 rounded text-xs font-mono transition-colors ${
                        tenure === m ? 'bg-[#3a352f] text-white font-bold' : 'bg-[#ede6da] text-[#554b3f]'
                      }`}
                    >
                      {m} mo
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Calculation Breakdown */}
              <div className="p-4 rounded-xl bg-[#f4efe4] border border-[#e2d7c5] space-y-2 text-xs">
                <div className="flex justify-between text-[#5f5446]">
                  <span>Principal Borrowed:</span>
                  <span className="font-mono font-medium text-[#2c2722]">${amount}.00</span>
                </div>
                <div className="flex justify-between text-[#5f5446]">
                  <span>Calculated Subsidized Interest ({loan.interestRateAnnual}% APR):</span>
                  <span className="font-mono text-[#4d7350]">${(loan.totalRepayment - amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#5f5446]">
                  <span>Monthly Repayment:</span>
                  <span className="font-mono font-bold text-[#2c2722]">${loan.monthlyInstallment} / month</span>
                </div>
                <div className="pt-2 border-t border-[#d8ccb8] flex justify-between font-serif text-sm font-bold text-[#2c2722]">
                  <span>Total Repayment Over {tenure} Months:</span>
                  <span>${loan.totalRepayment}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-[#6e6355] hover:text-[#2c2722] transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="px-6 py-2.5 text-xs font-medium text-[#faf8f5] bg-[#3a352f] hover:bg-[#1f1c19] rounded-lg transition-all duration-200 shadow-md flex items-center gap-2 active:scale-95"
                >
                  <span>Pre-Approve My Micro-Advance</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#d9c5a3]" />
                </button>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
