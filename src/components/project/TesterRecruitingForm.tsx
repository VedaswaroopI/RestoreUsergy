import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Check, ChevronsUpDown, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface TesterRecruitingFormProps {
  projectId: string;
  onBack: () => void;
  onContinue: () => void;
}

// Complete country list
const countryOptions = [
  { value: "afghanistan", label: "Afghanistan" },
  { value: "albania", label: "Albania" },
  { value: "algeria", label: "Algeria" },
  { value: "andorra", label: "Andorra" },
  { value: "angola", label: "Angola" },
  { value: "argentina", label: "Argentina" },
  { value: "armenia", label: "Armenia" },
  { value: "australia", label: "Australia" },
  { value: "austria", label: "Austria" },
  { value: "azerbaijan", label: "Azerbaijan" },
  { value: "bahrain", label: "Bahrain" },
  { value: "bangladesh", label: "Bangladesh" },
  { value: "barbados", label: "Barbados" },
  { value: "belarus", label: "Belarus" },
  { value: "belgium", label: "Belgium" },
  { value: "belize", label: "Belize" },
  { value: "benin", label: "Benin" },
  { value: "bhutan", label: "Bhutan" },
  { value: "bolivia", label: "Bolivia" },
  { value: "bosnia", label: "Bosnia and Herzegovina" },
  { value: "botswana", label: "Botswana" },
  { value: "brazil", label: "Brazil" },
  { value: "brunei", label: "Brunei" },
  { value: "bulgaria", label: "Bulgaria" },
  { value: "burkina-faso", label: "Burkina Faso" },
  { value: "burundi", label: "Burundi" },
  { value: "cambodia", label: "Cambodia" },
  { value: "cameroon", label: "Cameroon" },
  { value: "canada", label: "Canada" },
  { value: "cape-verde", label: "Cape Verde" },
  { value: "central-african-republic", label: "Central African Republic" },
  { value: "chad", label: "Chad" },
  { value: "chile", label: "Chile" },
  { value: "china", label: "China" },
  { value: "colombia", label: "Colombia" },
  { value: "comoros", label: "Comoros" },
  { value: "congo", label: "Congo" },
  { value: "costa-rica", label: "Costa Rica" },
  { value: "croatia", label: "Croatia" },
  { value: "cuba", label: "Cuba" },
  { value: "cyprus", label: "Cyprus" },
  { value: "czech-republic", label: "Czech Republic" },
  { value: "denmark", label: "Denmark" },
  { value: "djibouti", label: "Djibouti" },
  { value: "dominica", label: "Dominica" },
  { value: "dominican-republic", label: "Dominican Republic" },
  { value: "ecuador", label: "Ecuador" },
  { value: "egypt", label: "Egypt" },
  { value: "el-salvador", label: "El Salvador" },
  { value: "equatorial-guinea", label: "Equatorial Guinea" },
  { value: "eritrea", label: "Eritrea" },
  { value: "estonia", label: "Estonia" },
  { value: "ethiopia", label: "Ethiopia" },
  { value: "fiji", label: "Fiji" },
  { value: "finland", label: "Finland" },
  { value: "france", label: "France" },
  { value: "gabon", label: "Gabon" },
  { value: "gambia", label: "Gambia" },
  { value: "georgia", label: "Georgia" },
  { value: "germany", label: "Germany" },
  { value: "ghana", label: "Ghana" },
  { value: "greece", label: "Greece" },
  { value: "grenada", label: "Grenada" },
  { value: "guatemala", label: "Guatemala" },
  { value: "guinea", label: "Guinea" },
  { value: "guinea-bissau", label: "Guinea-Bissau" },
  { value: "guyana", label: "Guyana" },
  { value: "haiti", label: "Haiti" },
  { value: "honduras", label: "Honduras" },
  { value: "hungary", label: "Hungary" },
  { value: "iceland", label: "Iceland" },
  { value: "india", label: "India" },
  { value: "indonesia", label: "Indonesia" },
  { value: "iran", label: "Iran" },
  { value: "iraq", label: "Iraq" },
  { value: "ireland", label: "Ireland" },
  { value: "israel", label: "Israel" },
  { value: "italy", label: "Italy" },
  { value: "jamaica", label: "Jamaica" },
  { value: "japan", label: "Japan" },
  { value: "jordan", label: "Jordan" },
  { value: "kazakhstan", label: "Kazakhstan" },
  { value: "kenya", label: "Kenya" },
  { value: "kiribati", label: "Kiribati" },
  { value: "kuwait", label: "Kuwait" },
  { value: "kyrgyzstan", label: "Kyrgyzstan" },
  { value: "laos", label: "Laos" },
  { value: "latvia", label: "Latvia" },
  { value: "lebanon", label: "Lebanon" },
  { value: "lesotho", label: "Lesotho" },
  { value: "liberia", label: "Liberia" },
  { value: "libya", label: "Libya" },
  { value: "liechtenstein", label: "Liechtenstein" },
  { value: "lithuania", label: "Lithuania" },
  { value: "luxembourg", label: "Luxembourg" },
  { value: "madagascar", label: "Madagascar" },
  { value: "malawi", label: "Malawi" },
  { value: "malaysia", label: "Malaysia" },
  { value: "maldives", label: "Maldives" },
  { value: "mali", label: "Mali" },
  { value: "malta", label: "Malta" },
  { value: "marshall-islands", label: "Marshall Islands" },
  { value: "mauritania", label: "Mauritania" },
  { value: "mauritius", label: "Mauritius" },
  { value: "mexico", label: "Mexico" },
  { value: "micronesia", label: "Micronesia" },
  { value: "moldova", label: "Moldova" },
  { value: "monaco", label: "Monaco" },
  { value: "mongolia", label: "Mongolia" },
  { value: "montenegro", label: "Montenegro" },
  { value: "morocco", label: "Morocco" },
  { value: "mozambique", label: "Mozambique" },
  { value: "myanmar", label: "Myanmar" },
  { value: "namibia", label: "Namibia" },
  { value: "nauru", label: "Nauru" },
  { value: "nepal", label: "Nepal" },
  { value: "netherlands", label: "Netherlands" },
  { value: "new-zealand", label: "New Zealand" },
  { value: "nicaragua", label: "Nicaragua" },
  { value: "niger", label: "Niger" },
  { value: "nigeria", label: "Nigeria" },
  { value: "north-korea", label: "North Korea" },
  { value: "north-macedonia", label: "North Macedonia" },
  { value: "norway", label: "Norway" },
  { value: "oman", label: "Oman" },
  { value: "pakistan", label: "Pakistan" },
  { value: "palau", label: "Palau" },
  { value: "panama", label: "Panama" },
  { value: "papua-new-guinea", label: "Papua New Guinea" },
  { value: "paraguay", label: "Paraguay" },
  { value: "peru", label: "Peru" },
  { value: "philippines", label: "Philippines" },
  { value: "poland", label: "Poland" },
  { value: "portugal", label: "Portugal" },
  { value: "qatar", label: "Qatar" },
  { value: "romania", label: "Romania" },
  { value: "russia", label: "Russia" },
  { value: "rwanda", label: "Rwanda" },
  { value: "saint-kitts-and-nevis", label: "Saint Kitts and Nevis" },
  { value: "saint-lucia", label: "Saint Lucia" },
  { value: "saint-vincent-and-the-grenadines", label: "Saint Vincent and the Grenadines" },
  { value: "samoa", label: "Samoa" },
  { value: "san-marino", label: "San Marino" },
  { value: "sao-tome-and-principe", label: "Sao Tome and Principe" },
  { value: "saudi-arabia", label: "Saudi Arabia" },
  { value: "senegal", label: "Senegal" },
  { value: "serbia", label: "Serbia" },
  { value: "seychelles", label: "Seychelles" },
  { value: "sierra-leone", label: "Sierra Leone" },
  { value: "singapore", label: "Singapore" },
  { value: "slovakia", label: "Slovakia" },
  { value: "slovenia", label: "Slovenia" },
  { value: "solomon-islands", label: "Solomon Islands" },
  { value: "somalia", label: "Somalia" },
  { value: "south-africa", label: "South Africa" },
  { value: "south-korea", label: "South Korea" },
  { value: "south-sudan", label: "South Sudan" },
  { value: "spain", label: "Spain" },
  { value: "sri-lanka", label: "Sri Lanka" },
  { value: "sudan", label: "Sudan" },
  { value: "suriname", label: "Suriname" },
  { value: "sweden", label: "Sweden" },
  { value: "switzerland", label: "Switzerland" },
  { value: "syria", label: "Syria" },
  { value: "taiwan", label: "Taiwan" },
  { value: "tajikistan", label: "Tajikistan" },
  { value: "tanzania", label: "Tanzania" },
  { value: "thailand", label: "Thailand" },
  { value: "timor-leste", label: "Timor-Leste" },
  { value: "togo", label: "Togo" },
  { value: "tonga", label: "Tonga" },
  { value: "trinidad-and-tobago", label: "Trinidad and Tobago" },
  { value: "tunisia", label: "Tunisia" },
  { value: "turkey", label: "Turkey" },
  { value: "turkmenistan", label: "Turkmenistan" },
  { value: "tuvalu", label: "Tuvalu" },
  { value: "uganda", label: "Uganda" },
  { value: "ukraine", label: "Ukraine" },
  { value: "united-arab-emirates", label: "United Arab Emirates" },
  { value: "united-kingdom", label: "United Kingdom" },
  { value: "united-states", label: "United States" },
  { value: "uruguay", label: "Uruguay" },
  { value: "uzbekistan", label: "Uzbekistan" },
  { value: "vanuatu", label: "Vanuatu" },
  { value: "vatican-city", label: "Vatican City" },
  { value: "venezuela", label: "Venezuela" },
  { value: "vietnam", label: "Vietnam" },
  { value: "yemen", label: "Yemen" },
  { value: "zambia", label: "Zambia" },
  { value: "zimbabwe", label: "Zimbabwe" }
];

// Complete timezone list
const timezoneOptions = [
  { value: "gmt-12", label: "(GMT-12:00) International Date Line West" },
  { value: "gmt-11", label: "(GMT-11:00) Midway Island, Samoa" },
  { value: "gmt-10", label: "(GMT-10:00) Hawaii" },
  { value: "gmt-9", label: "(GMT-09:00) Alaska" },
  { value: "gmt-8", label: "(GMT-08:00) Pacific Time (US & Canada)" },
  { value: "gmt-7", label: "(GMT-07:00) Mountain Time (US & Canada)" },
  { value: "gmt-6", label: "(GMT-06:00) Central Time (US & Canada)" },
  { value: "gmt-5", label: "(GMT-05:00) Eastern Time (US & Canada)" },
  { value: "gmt-4", label: "(GMT-04:00) Atlantic Time (Canada)" },
  { value: "gmt-3", label: "(GMT-03:00) Brazil, Buenos Aires" },
  { value: "gmt-2", label: "(GMT-02:00) Mid-Atlantic" },
  { value: "gmt-1", label: "(GMT-01:00) Azores" },
  { value: "gmt+0", label: "(GMT+00:00) London, Dublin, Lisbon" },
  { value: "gmt+1", label: "(GMT+01:00) Berlin, Paris, Rome" },
  { value: "gmt+2", label: "(GMT+02:00) Athens, Cairo, Helsinki" },
  { value: "gmt+3", label: "(GMT+03:00) Moscow, Istanbul, Kuwait" },
  { value: "gmt+4", label: "(GMT+04:00) Abu Dhabi, Baku, Muscat" },
  { value: "gmt+5", label: "(GMT+05:00) Karachi, Tashkent" },
  { value: "gmt+6", label: "(GMT+06:00) Almaty, Dhaka" },
  { value: "gmt+7", label: "(GMT+07:00) Bangkok, Jakarta" },
  { value: "gmt+8", label: "(GMT+08:00) Beijing, Singapore, Perth" },
  { value: "gmt+9", label: "(GMT+09:00) Tokyo, Seoul, Osaka" },
  { value: "gmt+10", label: "(GMT+10:00) Sydney, Melbourne, Guam" },
  { value: "gmt+11", label: "(GMT+11:00) Magadan, Solomon Islands" },
  { value: "gmt+12", label: "(GMT+12:00) Auckland, Wellington" }
];

// Other options
const ageRangeOptions = [
  { value: "18-24", label: "18-24 years" },
  { value: "25-34", label: "25-34 years" },
  { value: "35-44", label: "35-44 years" },
  { value: "45-54", label: "45-54 years" },
  { value: "55-64", label: "55-64 years" },
  { value: "65+", label: "65+ years" }
];

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non-binary", label: "Non-binary" },
  { value: "prefer-not-to-say", label: "Prefer not to say" }
];

const deviceOptions = [
  "iPhone", "Android", "iPad", "Android Tablet", "Windows PC", "Mac", "Linux", "Smart TV", "Gaming Console", "Wearable Device"
];

const mobileManufacturerOptions = [
  { value: "apple", label: "Apple" },
  { value: "samsung", label: "Samsung" },
  { value: "google", label: "Google" },
  { value: "oneplus", label: "OnePlus" },
  { value: "xiaomi", label: "Xiaomi" },
  { value: "huawei", label: "Huawei" },
  { value: "oppo", label: "Oppo" },
  { value: "vivo", label: "Vivo" },
  { value: "sony", label: "Sony" },
  { value: "lg", label: "LG" }
];

const desktopManufacturerOptions = [
  { value: "apple", label: "Apple" },
  { value: "dell", label: "Dell" },
  { value: "hp", label: "HP" },
  { value: "lenovo", label: "Lenovo" },
  { value: "microsoft", label: "Microsoft" },
  { value: "asus", label: "ASUS" },
  { value: "acer", label: "Acer" },
  { value: "msi", label: "MSI" },
  { value: "custom-built", label: "Custom Built" }
];

const emailClientOptions = [
  { value: "gmail", label: "Gmail" },
  { value: "outlook", label: "Outlook" },
  { value: "apple-mail", label: "Apple Mail" },
  { value: "yahoo", label: "Yahoo Mail" },
  { value: "thunderbird", label: "Thunderbird" },
  { value: "protonmail", label: "ProtonMail" },
  { value: "fastmail", label: "FastMail" }
];

const streamingOptions = [
  { value: "netflix", label: "Netflix" },
  { value: "disney-plus", label: "Disney+" },
  { value: "hulu", label: "Hulu" },
  { value: "amazon-prime", label: "Amazon Prime Video" },
  { value: "hbo-max", label: "HBO Max" },
  { value: "youtube-premium", label: "YouTube Premium" },
  { value: "apple-tv", label: "Apple TV+" },
  { value: "paramount", label: "Paramount+" },
  { value: "peacock", label: "Peacock" }
];

const musicOptions = [
  { value: "spotify", label: "Spotify" },
  { value: "apple-music", label: "Apple Music" },
  { value: "youtube-music", label: "YouTube Music" },
  { value: "amazon-music", label: "Amazon Music" },
  { value: "pandora", label: "Pandora" },
  { value: "tidal", label: "Tidal" },
  { value: "deezer", label: "Deezer" }
];

const educationOptions = [
  { value: "high-school", label: "High School" },
  { value: "some-college", label: "Some College" },
  { value: "associate", label: "Associate Degree" },
  { value: "bachelors", label: "Bachelor's Degree" },
  { value: "masters", label: "Master's Degree" },
  { value: "phd", label: "PhD/Doctorate" },
  { value: "professional", label: "Professional Degree" }
];

const incomeOptions = [
  { value: "under-25k", label: "Under $25,000" },
  { value: "25k-50k", label: "$25,000 - $50,000" },
  { value: "50k-75k", label: "$50,000 - $75,000" },
  { value: "75k-100k", label: "$75,000 - $100,000" },
  { value: "100k-150k", label: "$100,000 - $150,000" },
  { value: "150k-200k", label: "$150,000 - $200,000" },
  { value: "200k+", label: "$200,000+" }
];

const workRoleOptions = [
  { value: "software-engineer", label: "Software Engineer" },
  { value: "product-manager", label: "Product Manager" },
  { value: "designer", label: "Designer" },
  { value: "marketing", label: "Marketing Professional" },
  { value: "sales", label: "Sales Professional" },
  { value: "executive", label: "Executive" },
  { value: "consultant", label: "Consultant" },
  { value: "data-scientist", label: "Data Scientist" },
  { value: "researcher", label: "Researcher" },
  { value: "teacher", label: "Teacher/Educator" },
  { value: "healthcare", label: "Healthcare Professional" },
  { value: "entrepreneur", label: "Entrepreneur" },
  { value: "student", label: "Student" },
  { value: "other", label: "Other" }
];

const industryOptions = [
  { value: "technology", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance" },
  { value: "education", label: "Education" },
  { value: "retail", label: "Retail" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "consulting", label: "Consulting" },
  { value: "media", label: "Media & Entertainment" },
  { value: "government", label: "Government" },
  { value: "non-profit", label: "Non-Profit" },
  { value: "automotive", label: "Automotive" },
  { value: "aerospace", label: "Aerospace" },
  { value: "energy", label: "Energy" },
  { value: "other", label: "Other" }
];

const jobFunctionOptions = [
  { value: "engineering", label: "Engineering" },
  { value: "product", label: "Product" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "operations", label: "Operations" },
  { value: "hr", label: "Human Resources" },
  { value: "finance", label: "Finance" },
  { value: "customer-success", label: "Customer Success" },
  { value: "data-analytics", label: "Data & Analytics" },
  { value: "legal", label: "Legal" },
  { value: "it", label: "Information Technology" }
];

const companySizeOptions = [
  { value: "freelance", label: "Freelance/Self-employed" },
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-1000", label: "201-1000 employees" },
  { value: "1001-5000", label: "1001-5000 employees" },
  { value: "5000+", label: "5000+ employees" }
];

const techExperienceOptions = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" }
];

const aiInterestsOptions = [
  { value: "productivity", label: "Productivity & Automation" },
  { value: "creative", label: "Creative & Content Generation" },
  { value: "coding", label: "Coding & Development" },
  { value: "research", label: "Research & Analysis" },
  { value: "writing", label: "Writing & Communication" },
  { value: "data-analysis", label: "Data Analysis" },
  { value: "business", label: "Business & Strategy" },
  { value: "education", label: "Education & Learning" },
  { value: "healthcare", label: "Healthcare & Medical" },
  { value: "finance", label: "Finance & Investment" }
];

const aiModelsOptions = [
  { value: "chatgpt", label: "ChatGPT" },
  { value: "claude", label: "Claude" },
  { value: "gemini", label: "Gemini" },
  { value: "copilot", label: "GitHub Copilot" },
  { value: "midjourney", label: "Midjourney" },
  { value: "dall-e", label: "DALL-E" },
  { value: "stable-diffusion", label: "Stable Diffusion" },
  { value: "cursor", label: "Cursor" },
  { value: "perplexity", label: "Perplexity" },
  { value: "jasper", label: "Jasper" }
];

const programmingLanguagesOptions = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "typescript", label: "TypeScript" },
  { value: "react", label: "React" },
  { value: "node", label: "Node.js" },
  { value: "sql", label: "SQL" },
  { value: "html-css", label: "HTML/CSS" },
  { value: "c#", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" }
];

const aiFamiliarityOptions = [
  { value: "never-used", label: "Never Used AI Tools" },
  { value: "basic", label: "Basic - Occasional Use" },
  { value: "intermediate", label: "Intermediate - Regular Use" },
  { value: "advanced", label: "Advanced - Daily Use" },
  { value: "expert", label: "Expert - Power User" }
];

const specificSkillsOptions = [
  { value: "ux-design", label: "UX Design" },
  { value: "ui-design", label: "UI Design" },
  { value: "frontend", label: "Frontend Development" },
  { value: "backend", label: "Backend Development" },
  { value: "mobile", label: "Mobile Development" },
  { value: "data-analysis", label: "Data Analysis" },
  { value: "project-management", label: "Project Management" },
  { value: "content-creation", label: "Content Creation" },
  { value: "digital-marketing", label: "Digital Marketing" },
  { value: "seo", label: "SEO/SEM" },
  { value: "graphic-design", label: "Graphic Design" },
  { value: "video-editing", label: "Video Editing" },
  { value: "copywriting", label: "Copywriting" },
  { value: "photography", label: "Photography" }
];

const contributionOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" }
];

const socialNetworksOptions = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter/X" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "reddit", label: "Reddit" },
  { value: "discord", label: "Discord" },
  { value: "twitch", label: "Twitch" },
  { value: "pinterest", label: "Pinterest" },
  { value: "snapchat", label: "Snapchat" },
  { value: "telegram", label: "Telegram" }
];

export function TesterRecruitingForm({ projectId, onBack, onContinue }: TesterRecruitingFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  
  const [formData, setFormData] = useState({
    userCount: "",
    // All fields are now arrays for multi-select
    basicProfile: {
      age: [] as string[],
      gender: [] as string[],
      country: [] as string[],
      timezone: [] as string[]
    },
    devices: [] as string[],
    deviceUsage: {
      mobileManufacturers: [] as string[],
      desktopManufacturers: [] as string[],
      emailClients: [] as string[],
      streamingSubscriptions: [] as string[],
      musicSubscriptions: [] as string[]
    },
    educationWork: {
      educationLevel: [] as string[],
      householdIncome: [] as string[],
      primaryWorkRole: [] as string[],
      employmentIndustry: [] as string[],
      jobFunction: [] as string[],
      companySize: [] as string[]
    },
    aiTech: {
      technicalExperience: [] as string[],
      aiInterests: [] as string[],
      aiModels: [] as string[],
      programmingLanguages: [] as string[],
      aiFamiliarity: [] as string[]
    },
    socialSkills: {
      specificSkills: [] as string[],
      socialNetworks: [] as string[]
    }
  });

  const handleMultiSelect = (category: string, field: string, value: string) => {
    setFormData(prev => {
      const categoryData = prev[category as keyof typeof prev] as any;
      const currentArray = categoryData[field] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item: string) => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        [category]: {
          ...categoryData,
          [field]: newArray
        }
      };
    });
  };

  const handleDeviceToggle = (device: string) => {
    setFormData(prev => ({
      ...prev,
      devices: prev.devices.includes(device)
        ? prev.devices.filter(d => d !== device)
        : [...prev.devices, device]
    }));
  };

  const handleSave = async () => {
    if (!formData.userCount || parseInt(formData.userCount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid number of users.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const recruitingCriteria = {
        userCount: parseInt(formData.userCount),
        basicProfile: formData.basicProfile,
        devices: formData.devices,
        deviceUsage: formData.deviceUsage,
        educationWork: formData.educationWork,
        aiTech: formData.aiTech,
        socialSkills: formData.socialSkills
      };

      const { error } = await supabase
        .from('projects')
        .update({
          target_testers: parseInt(formData.userCount),
          recruiting_config: recruitingCriteria
        })
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User audience criteria saved successfully.",
      });

      onContinue();
    } catch (error) {
      console.error('Error saving user recruiting data:', error);
      toast({
        title: "Error",
        description: "Failed to save user recruiting data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter Block Component
  const FilterBlock = ({ 
    title, 
    options, 
    selectedValues, 
    onValueChange, 
    placeholder = "Select options..." 
  }: {
    title: string;
    options: { value: string; label: string }[];
    selectedValues: string[];
    onValueChange: (values: string[]) => void;
    placeholder?: string;
  }) => {
    const [open, setOpen] = useState(false);

    const handleSelect = (value: string) => {
      const newValues = selectedValues.includes(value)
        ? selectedValues.filter(v => v !== value)
        : [...selectedValues, value];
      onValueChange(newValues);
    };

    const handleRemove = (value: string) => {
      onValueChange(selectedValues.filter(v => v !== value));
    };

    return (
      <Card className="p-6 bg-gradient-to-br from-background to-muted/20 border border-muted/50 hover:border-primary/30 transition-all duration-200">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-base font-semibold text-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-3">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between h-auto min-h-[2.5rem] bg-background/50"
              >
                <div className="flex flex-wrap gap-1 flex-1">
                  {selectedValues.length === 0 ? (
                    <span className="text-muted-foreground">{placeholder}</span>
                  ) : (
                    selectedValues.slice(0, 2).map((value) => {
                      const option = options.find(opt => opt.value === value);
                      return (
                        <Badge key={value} variant="secondary" className="mr-1">
                          {option?.label}
                        </Badge>
                      );
                    })
                  )}
                  {selectedValues.length > 2 && (
                    <Badge variant="outline">+{selectedValues.length - 2} more</Badge>
                  )}
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder={`Search ${title.toLowerCase()}...`} />
                <CommandList>
                  <CommandEmpty>No options found.</CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => (
                       <CommandItem
                         key={option.value}
                         value={option.value}
                         onSelect={() => {
                           handleSelect(option.value);
                           // Don't close the popover
                         }}
                       >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedValues.includes(option.value) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          
          {selectedValues.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {selectedValues.map((value) => {
                const option = options.find(opt => opt.value === value);
                return (
                  <Badge key={value} variant="secondary" className="pr-1">
                    {option?.label}
                    <button
                      onClick={() => handleRemove(value)}
                      className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-foreground">Audience Builder</h1>
        <p className="text-muted-foreground text-base max-w-2xl mx-auto">
          Pinpoint the exact users you need to gather powerful insights and build early traction.
        </p>
      </div>

      {/* How many users? Header Card */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <div className="flex flex-col items-center text-center space-y-4">
          <Label htmlFor="userCount" className="text-xl font-bold text-foreground">
            How many users do you need?
          </Label>
          <Input
            id="userCount"
            type="number"
            min="1"
            value={formData.userCount}
            onChange={(e) => setFormData(prev => ({ ...prev, userCount: e.target.value }))}
            placeholder="e.g., 50"
            className="w-32 text-center text-xl font-semibold h-10 bg-background/80"
          />
          <p className="text-sm text-muted-foreground">
            Our standard rate is $35 per user. The total cost will be calculated at the final step.
          </p>
        </div>
      </Card>

      {/* Main Targeting Container with Tabs */}
      <Card className="p-8 bg-gradient-to-br from-background to-muted/10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-16 p-2 bg-muted/30 mb-8 gap-2">
            <TabsTrigger value="basic" className="text-sm font-medium px-4 py-2 text-black data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Basic Profile
            </TabsTrigger>
            <TabsTrigger value="devices" className="text-sm font-medium px-4 py-2 text-black data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Devices & Usage
            </TabsTrigger>
            <TabsTrigger value="education" className="text-sm font-medium px-4 py-2 text-black data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Education & Work
            </TabsTrigger>
            <TabsTrigger value="aitech" className="text-sm font-medium px-4 py-2 text-black data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              AI & Tech Fluency
            </TabsTrigger>
            <TabsTrigger value="social" className="text-sm font-medium px-4 py-2 text-black data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Social & Skills
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Basic Profile */}
          <TabsContent value="basic" className="space-y-6 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FilterBlock
                title="User Age Range"
                options={ageRangeOptions}
                selectedValues={formData.basicProfile.age}
                onValueChange={(values) => setFormData(prev => ({ ...prev, basicProfile: { ...prev.basicProfile, age: values } }))}
                placeholder="Select age ranges..."
              />
              <FilterBlock
                title="User Gender"
                options={genderOptions}
                selectedValues={formData.basicProfile.gender}
                onValueChange={(values) => setFormData(prev => ({ ...prev, basicProfile: { ...prev.basicProfile, gender: values } }))}
                placeholder="Select genders..."
              />
              <FilterBlock
                title="User Country"
                options={countryOptions}
                selectedValues={formData.basicProfile.country}
                onValueChange={(values) => setFormData(prev => ({ ...prev, basicProfile: { ...prev.basicProfile, country: values } }))}
                placeholder="Select countries..."
              />
              <FilterBlock
                title="User Timezone"
                options={timezoneOptions}
                selectedValues={formData.basicProfile.timezone}
                onValueChange={(values) => setFormData(prev => ({ ...prev, basicProfile: { ...prev.basicProfile, timezone: values } }))}
                placeholder="Select timezones..."
              />
            </div>
          </TabsContent>

          {/* Tab 2: Devices & Product Usage */}
          <TabsContent value="devices" className="space-y-8 mt-8">
            <div className="space-y-6">
              <Card className="p-6 bg-gradient-to-br from-background to-muted/20 border border-muted/20">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-base font-semibold text-foreground">User Devices</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {deviceOptions.map((device) => (
                      <Card 
                        key={device}
                        className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                          formData.devices.includes(device) 
                            ? 'bg-primary/10 border-primary shadow-sm' 
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => handleDeviceToggle(device)}
                      >
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={formData.devices.includes(device)}
                            onChange={() => handleDeviceToggle(device)}
                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <span className="text-sm font-medium text-foreground">
                            {device}
                          </span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FilterBlock
                  title="Mobile Manufacturers"
                  options={mobileManufacturerOptions}
                  selectedValues={formData.deviceUsage.mobileManufacturers}
                  onValueChange={(values) => setFormData(prev => ({ ...prev, deviceUsage: { ...prev.deviceUsage, mobileManufacturers: values } }))}
                />
                <FilterBlock
                  title="Desktop/Laptop Manufacturers"
                  options={desktopManufacturerOptions}
                  selectedValues={formData.deviceUsage.desktopManufacturers}
                  onValueChange={(values) => setFormData(prev => ({ ...prev, deviceUsage: { ...prev.deviceUsage, desktopManufacturers: values } }))}
                />
                <FilterBlock
                  title="Email Clients"
                  options={emailClientOptions}
                  selectedValues={formData.deviceUsage.emailClients}
                  onValueChange={(values) => setFormData(prev => ({ ...prev, deviceUsage: { ...prev.deviceUsage, emailClients: values } }))}
                />
                <FilterBlock
                  title="Streaming Subscriptions"
                  options={streamingOptions}
                  selectedValues={formData.deviceUsage.streamingSubscriptions}
                  onValueChange={(values) => setFormData(prev => ({ ...prev, deviceUsage: { ...prev.deviceUsage, streamingSubscriptions: values } }))}
                />
                <FilterBlock
                  title="Music Subscriptions"
                  options={musicOptions}
                  selectedValues={formData.deviceUsage.musicSubscriptions}
                  onValueChange={(values) => setFormData(prev => ({ ...prev, deviceUsage: { ...prev.deviceUsage, musicSubscriptions: values } }))}
                />
              </div>
            </div>
          </TabsContent>

          {/* Tab 3: Education & Work */}
          <TabsContent value="education" className="space-y-6 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FilterBlock
                title="User Education Level"
                options={educationOptions}
                selectedValues={formData.educationWork.educationLevel}
                onValueChange={(values) => setFormData(prev => ({ ...prev, educationWork: { ...prev.educationWork, educationLevel: values } }))}
              />
              <FilterBlock
                title="User Household Income"
                options={incomeOptions}
                selectedValues={formData.educationWork.householdIncome}
                onValueChange={(values) => setFormData(prev => ({ ...prev, educationWork: { ...prev.educationWork, householdIncome: values } }))}
              />
              <FilterBlock
                title="User Work Role"
                options={workRoleOptions}
                selectedValues={formData.educationWork.primaryWorkRole}
                onValueChange={(values) => setFormData(prev => ({ ...prev, educationWork: { ...prev.educationWork, primaryWorkRole: values } }))}
              />
              <FilterBlock
                title="User Employment Industry"
                options={industryOptions}
                selectedValues={formData.educationWork.employmentIndustry}
                onValueChange={(values) => setFormData(prev => ({ ...prev, educationWork: { ...prev.educationWork, employmentIndustry: values } }))}
              />
              <FilterBlock
                title="User Job Function"
                options={jobFunctionOptions}
                selectedValues={formData.educationWork.jobFunction}
                onValueChange={(values) => setFormData(prev => ({ ...prev, educationWork: { ...prev.educationWork, jobFunction: values } }))}
              />
              <FilterBlock
                title="User Company Size"
                options={companySizeOptions}
                selectedValues={formData.educationWork.companySize}
                onValueChange={(values) => setFormData(prev => ({ ...prev, educationWork: { ...prev.educationWork, companySize: values } }))}
              />
            </div>
          </TabsContent>

          {/* Tab 4: AI & Tech Fluency */}
          <TabsContent value="aitech" className="space-y-6 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FilterBlock
                title="User Technical Experience"
                options={techExperienceOptions}
                selectedValues={formData.aiTech.technicalExperience}
                onValueChange={(values) => setFormData(prev => ({ ...prev, aiTech: { ...prev.aiTech, technicalExperience: values } }))}
              />
              <FilterBlock
                title="User AI Familiarity"
                options={aiFamiliarityOptions}
                selectedValues={formData.aiTech.aiFamiliarity}
                onValueChange={(values) => setFormData(prev => ({ ...prev, aiTech: { ...prev.aiTech, aiFamiliarity: values } }))}
              />
              <FilterBlock
                title="User AI Interests"
                options={aiInterestsOptions}
                selectedValues={formData.aiTech.aiInterests}
                onValueChange={(values) => setFormData(prev => ({ ...prev, aiTech: { ...prev.aiTech, aiInterests: values } }))}
              />
              <FilterBlock
                title="User AI Models Experience"
                options={aiModelsOptions}
                selectedValues={formData.aiTech.aiModels}
                onValueChange={(values) => setFormData(prev => ({ ...prev, aiTech: { ...prev.aiTech, aiModels: values } }))}
              />
              <FilterBlock
                title="User Programming Languages"
                options={programmingLanguagesOptions}
                selectedValues={formData.aiTech.programmingLanguages}
                onValueChange={(values) => setFormData(prev => ({ ...prev, aiTech: { ...prev.aiTech, programmingLanguages: values } }))}
              />
            </div>
          </TabsContent>

          {/* Tab 5: Social & Skills */}
          <TabsContent value="social" className="space-y-6 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FilterBlock
                title="User Specific Skills"
                options={specificSkillsOptions}
                selectedValues={formData.socialSkills.specificSkills}
                onValueChange={(values) => setFormData(prev => ({ ...prev, socialSkills: { ...prev.socialSkills, specificSkills: values } }))}
              />
              <FilterBlock
                title="User Social Networks"
                options={socialNetworksOptions}
                selectedValues={formData.socialSkills.socialNetworks}
                onValueChange={(values) => setFormData(prev => ({ ...prev, socialSkills: { ...prev.socialSkills, socialNetworks: values } }))}
              />
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="px-6 py-3 font-medium"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Button
          onClick={handleSave}
          disabled={isLoading}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          {isLoading ? (
            "Saving..."
          ) : (
            <>
              Save & Continue to Screening
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
