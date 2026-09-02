import { NetworkConfig, DataPlan, AirtimeDiscount, Transaction, UserProfile, FundingRequest, ReferralStats, Network } from "../types";

export const NETWORK_CONFIGS: Record<string, NetworkConfig> = {
  MTN: {
    name: "MTN",
    color: "#FFCC00",
    bgColor: "#FFF9DB",
    borderColor: "#E6B800",
    prefixColor: "#FFCC00",
    gradientFrom: "#FFCC00",
    gradientTo: "#FFB800",
    prefixes: ["0803", "0806", "0810", "0813", "0814", "0816", "0817", "0818", "0820", "0903", "0906", "0913", "0914", "0916", "0917", "0920", "0923", "0924", "0926", "0927", "0933", "0934", "0935", "0937"],
  },
  GLO: {
    name: "GLO",
    color: "#00843D",
    bgColor: "#E6F7EE",
    borderColor: "#006B31",
    prefixColor: "#00843D",
    gradientFrom: "#00843D",
    gradientTo: "#006B31",
    prefixes: ["0805", "0807", "0811", "0815", "0819", "0821", "0905", "0907", "0908", "0909", "0915", "0921", "0925", "0929"],
  },
  AIRTEL: {
    name: "AIRTEL",
    color: "#E60000",
    bgColor: "#FFE6E6",
    borderColor: "#CC0000",
    prefixColor: "#E60000",
    gradientFrom: "#E60000",
    gradientTo: "#CC0000",
    prefixes: ["0802", "0808", "0812", "0814", "0901", "0902", "0904", "0934", "0936", "0937", "0938"],
  },
  "9MOBILE": {
    name: "9MOBILE",
    color: "#005C2B",
    bgColor: "#E6F2EC",
    borderColor: "#004420",
    prefixColor: "#005C2B",
    gradientFrom: "#005C2B",
    gradientTo: "#004420",
    prefixes: ["0809", "0810", "0818", "0909"],
  },
};

export const DATA_PLANS: DataPlan[] = [
  // MTN SME
  { id: "mtn-sme-500", network: "MTN", type: "SME", size: "500MB", validity: "30 Days", price: 150, popular: true },
  { id: "mtn-sme-1gb", network: "MTN", type: "SME", size: "1GB", validity: "30 Days", price: 290, popular: true },
  { id: "mtn-sme-2gb", network: "MTN", type: "SME", size: "2GB", validity: "30 Days", price: 580 },
  { id: "mtn-sme-3gb", network: "MTN", type: "SME", size: "3GB", validity: "30 Days", price: 870 },
  { id: "mtn-sme-5gb", network: "MTN", type: "SME", size: "5GB", validity: "30 Days", price: 1450 },
  { id: "mtn-sme-10gb", network: "MTN", type: "SME", size: "10GB", validity: "30 Days", price: 2900 },
  // MTN Direct
  { id: "mtn-dir-1gb", network: "MTN", type: "Direct", size: "1GB", validity: "30 Days", price: 480 },
  { id: "mtn-dir-2gb", network: "MTN", type: "Direct", size: "2GB", validity: "30 Days", price: 960 },
  { id: "mtn-dir-5gb", network: "MTN", type: "Direct", size: "5GB", validity: "30 Days", price: 2400 },
  { id: "mtn-dir-10gb", network: "MTN", type: "Direct", size: "10GB", validity: "30 Days", price: 4800 },
  // MTN Gifting
  { id: "mtn-gift-1gb", network: "MTN", type: "Gifting", size: "1GB", validity: "30 Days", price: 460 },
  { id: "mtn-gift-2gb", network: "MTN", type: "Gifting", size: "2GB", validity: "30 Days", price: 920 },
  { id: "mtn-gift-5gb", network: "MTN", type: "Gifting", size: "5GB", validity: "30 Days", price: 2300 },
  // Airtel
  { id: "airt-sme-500", network: "AIRTEL", type: "SME", size: "500MB", validity: "30 Days", price: 150 },
  { id: "airt-sme-1gb", network: "AIRTEL", type: "SME", size: "1GB", validity: "30 Days", price: 280, popular: true },
  { id: "airt-sme-2gb", network: "AIRTEL", type: "SME", size: "2GB", validity: "30 Days", price: 560 },
  { id: "airt-sme-5gb", network: "AIRTEL", type: "SME", size: "5GB", validity: "30 Days", price: 1400 },
  { id: "airt-sme-10gb", network: "AIRTEL", type: "SME", size: "10GB", validity: "30 Days", price: 2800 },
  { id: "airt-dir-1gb", network: "AIRTEL", type: "Direct", size: "1GB", validity: "30 Days", price: 480 },
  { id: "airt-dir-2gb", network: "AIRTEL", type: "Direct", size: "2GB", validity: "30 Days", price: 960 },
  { id: "airt-dir-5gb", network: "AIRTEL", type: "Direct", size: "5GB", validity: "30 Days", price: 2400 },
  { id: "airt-corp-1gb", network: "AIRTEL", type: "Corporate", size: "1GB", validity: "30 Days", price: 300 },
  { id: "airt-corp-2gb", network: "AIRTEL", type: "Corporate", size: "2GB", validity: "30 Days", price: 600 },
  { id: "airt-corp-5gb", network: "AIRTEL", type: "Corporate", size: "5GB", validity: "30 Days", price: 1500 },
  // Glo
  { id: "glo-sme-1gb", network: "GLO", type: "SME", size: "1GB", validity: "30 Days", price: 280 },
  { id: "glo-sme-2gb", network: "GLO", type: "SME", size: "2GB", validity: "30 Days", price: 560 },
  { id: "glo-sme-3gb", network: "GLO", type: "SME", size: "3GB", validity: "30 Days", price: 840 },
  { id: "glo-sme-5gb", network: "GLO", type: "SME", size: "5GB", validity: "30 Days", price: 1400, popular: true },
  { id: "glo-sme-10gb", network: "GLO", type: "SME", size: "10GB", validity: "30 Days", price: 2800 },
  { id: "glo-dir-1gb", network: "GLO", type: "Direct", size: "1GB", validity: "30 Days", price: 450 },
  { id: "glo-dir-2gb", network: "GLO", type: "Direct", size: "2GB", validity: "30 Days", price: 900 },
  { id: "glo-dir-5gb", network: "GLO", type: "Direct", size: "5GB", validity: "30 Days", price: 2250 },
  // 9mobile
  { id: "9mob-sme-1gb", network: "9MOBILE", type: "SME", size: "1GB", validity: "30 Days", price: 250 },
  { id: "9mob-sme-2gb", network: "9MOBILE", type: "SME", size: "2GB", validity: "30 Days", price: 500 },
  { id: "9mob-sme-3gb", network: "9MOBILE", type: "SME", size: "3GB", validity: "30 Days", price: 750 },
  { id: "9mob-sme-5gb", network: "9MOBILE", type: "SME", size: "5GB", validity: "30 Days", price: 1250 },
  { id: "9mob-sme-10gb", network: "9MOBILE", type: "SME", size: "10GB", validity: "30 Days", price: 2500 },
  { id: "9mob-dir-1gb", network: "9MOBILE", type: "Direct", size: "1GB", validity: "30 Days", price: 400 },
  { id: "9mob-dir-2gb", network: "9MOBILE", type: "Direct", size: "2GB", validity: "30 Days", price: 800 },
  { id: "9mob-dir-5gb", network: "9MOBILE", type: "Direct", size: "5GB", validity: "30 Days", price: 2000 },
];

export const AIRTIME_DISCOUNTS: AirtimeDiscount[] = [
  { network: "MTN", minAmount: 500, discountPercent: 1.5 },
  { network: "GLO", minAmount: 500, discountPercent: 2 },
  { network: "AIRTEL", minAmount: 500, discountPercent: 1.5 },
  { network: "9MOBILE", minAmount: 500, discountPercent: 2 },
];

export const AIRTIME_PRESETS = [100, 200, 300, 500, 1000, 2000, 5000];

export const BANK_DETAILS = {
  accountName: "Yahuza Data Hub Ltd",
  accountNumber: "7788990011",
  bankName: "Moniepoint MFB",
  altBank: "OPay",
  altAccount: "9012345678",
};

export const DEMO_USER: UserProfile = {
  name: "Demo User",
  phone: "08012345678",
  email: "demo@yahuza.com",
  referralCode: "YAHUZA-USR88",
};

export function generateReference(): string {
  return `YHZ-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

export function detectNetwork(phone: string): Network | null {
  if (!phone || phone.length < 4) return null;
  const prefix = phone.substring(0, 4);
  for (const [net, cfg] of Object.entries(NETWORK_CONFIGS)) {
    if (cfg.prefixes.includes(prefix)) return net as Network;
  }
  return null;
}

export function formatNaira(amount: number): string {
  return "₦" + amount.toLocaleString("en-NG");
}