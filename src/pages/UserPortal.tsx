import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Plus, Trash2, Upload, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import bcryptjs from 'bcryptjs';
import { Progress } from '@/components/ui/progress';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';
import InternalHeader from '@/components/InternalHeader';

const UserPortal = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('basic');
  const [completedSections, setCompletedSections] = useState(new Set<string>());
  const [unlockedTabs, setUnlockedTabs] = useState(new Set<string>(['basic']));
  const [user, setUser] = useState<any>(null);
  const [profileData, setProfileData] = useState({
    profile_pic_url: '',
    password_hash: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    age: 18,
    gender: '',
    languages_spoken: [] as string[],
    country: '',
    state: '',
    zip_code: '',
    timezone: '',
    education_level: '',
    primary_area_of_study: '',
    household_income: '',
    is_parent: false,
    primary_work_role: '',
    employment_industry: '',
    job_function: '',
    company_size: '',
    technical_experience: '',
    ai_interests: [] as string[],
    ai_familiarity: '',
    ai_models_used: [] as string[],
    programming_languages: [] as string[],
    specific_skills: [] as string[],
    ai_tools_discovery: '',
    social_networks: [] as string[],
    social_media_hours: '',
    portfolio_url: '',
    linkedin_url: '',
    twitter_url: '',
    has_projects: false,
    help_amplify_products: [] as string[],
    public_testimonials_ok: false,
    discord_username: '',
    email_clients: [] as string[],
    cell_phone_network: '',
    streaming_subscriptions: [] as string[],
    music_subscriptions: [] as string[],
    mobile_devices: [] as any[],
    desktop_devices: [] as any[],
    no_mobile_tablet: false,
    no_desktop_laptop: false,
  });
  
  const [devices, setDevices] = useState([
    { device_type: '', operating_system: '', manufacturer: '', model: '' }
  ]);
  
  // Device management state
  const [editingMobileDevice, setEditingMobileDevice] = useState(null);
  const [editingDesktopDevice, setEditingDesktopDevice] = useState(null);
  const [selectedMobileIndex, setSelectedMobileIndex] = useState(null);
  const [selectedDesktopIndex, setSelectedDesktopIndex] = useState(null);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [timezoneOpen, setTimezoneOpen] = useState(false);
  const [mobileManufacturerOpen, setMobileManufacturerOpen] = useState(false);
  const [mobileOSOpen, setMobileOSOpen] = useState(false);
  const [desktopOSOpen, setDesktopOSOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'JP', name: 'Japan' },
    { code: 'IN', name: 'India' },
    { code: 'BR', name: 'Brazil' },
    { code: 'MX', name: 'Mexico' },
    { code: 'ES', name: 'Spain' },
    { code: 'IT', name: 'Italy' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'SE', name: 'Sweden' },
    { code: 'NO', name: 'Norway' },
    { code: 'DK', name: 'Denmark' },
    { code: 'FI', name: 'Finland' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'AT', name: 'Austria' },
    { code: 'BE', name: 'Belgium' },
    { code: 'IE', name: 'Ireland' },
    { code: 'NZ', name: 'New Zealand' },
    { code: 'SG', name: 'Singapore' },
    { code: 'HK', name: 'Hong Kong' },
    { code: 'KR', name: 'South Korea' },
    { code: 'CN', name: 'China' },
    { code: 'TW', name: 'Taiwan' },
    { code: 'MY', name: 'Malaysia' },
    { code: 'TH', name: 'Thailand' },
    { code: 'PH', name: 'Philippines' },
    { code: 'ID', name: 'Indonesia' },
    { code: 'VN', name: 'Vietnam' },
    { code: 'AR', name: 'Argentina' },
    { code: 'CL', name: 'Chile' },
    { code: 'CO', name: 'Colombia' },
    { code: 'PE', name: 'Peru' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'EG', name: 'Egypt' },
    { code: 'IL', name: 'Israel' },
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'RU', name: 'Russia' },
    { code: 'UA', name: 'Ukraine' },
    { code: 'PL', name: 'Poland' },
    { code: 'CZ', name: 'Czech Republic' },
    { code: 'HU', name: 'Hungary' },
    { code: 'RO', name: 'Romania' },
    { code: 'GR', name: 'Greece' },
    { code: 'PT', name: 'Portugal' },
    { code: 'TR', name: 'Turkey' },
    { code: 'Other', name: 'Other' }
  ];

  const timezones = [
    { value: 'Pacific/Honolulu', label: '(GMT-10:00) Hawaii' },
    { value: 'America/Anchorage', label: '(GMT-08:00) Alaska' },
    { value: 'America/Los_Angeles', label: '(GMT-08:00) Pacific Time (US & Canada)' },
    { value: 'America/Denver', label: '(GMT-07:00) Mountain Time (US & Canada)' },
    { value: 'America/Chicago', label: '(GMT-06:00) Central Time (US & Canada)' },
    { value: 'America/New_York', label: '(GMT-05:00) Eastern Time (US & Canada)' },
    { value: 'America/Halifax', label: '(GMT-04:00) Atlantic Time (Canada)' },
    { value: 'America/St_Johns', label: '(GMT-03:30) Newfoundland' },
    { value: 'America/Sao_Paulo', label: '(GMT-03:00) Brasilia' },
    { value: 'Atlantic/Azores', label: '(GMT-01:00) Azores' },
    { value: 'Europe/London', label: '(GMT+00:00) London, Edinburgh, Dublin' },
    { value: 'Europe/Paris', label: '(GMT+01:00) Paris, Berlin, Rome' },
    { value: 'Europe/Helsinki', label: '(GMT+02:00) Helsinki, Athens, Istanbul' },
    { value: 'Europe/Moscow', label: '(GMT+03:00) Moscow, St. Petersburg' },
    { value: 'Asia/Dubai', label: '(GMT+04:00) Dubai, Abu Dhabi' },
    { value: 'Asia/Karachi', label: '(GMT+05:00) Islamabad, Karachi' },
    { value: 'Asia/Kolkata', label: '(GMT+05:30) New Delhi, Mumbai, Kolkata' },
    { value: 'Asia/Dhaka', label: '(GMT+06:00) Dhaka, Astana' },
    { value: 'Asia/Bangkok', label: '(GMT+07:00) Bangkok, Hanoi, Jakarta' },
    { value: 'Asia/Shanghai', label: '(GMT+08:00) Beijing, Shanghai, Hong Kong' },
    { value: 'Asia/Tokyo', label: '(GMT+09:00) Tokyo, Seoul, Osaka' },
    { value: 'Australia/Sydney', label: '(GMT+10:00) Sydney, Melbourne' },
    { value: 'Pacific/Auckland', label: '(GMT+12:00) Auckland, Wellington' },
    { value: 'Pacific/Kiritimati', label: '(GMT+14:00) Kiritimati' }
  ];

  const sections = [
    { id: 'basic', title: 'Basic Profile', fields: ['first_name', 'last_name', 'age', 'gender', 'country', 'timezone'] },
    { id: 'devices', title: 'Devices & Product Usage', fields: ['email_clients'] },
    { id: 'education', title: 'Education & Work', fields: ['education_level', 'primary_area_of_study', 'primary_work_role', 'employment_industry', 'job_function', 'company_size'] },
    { id: 'ai', title: 'AI & Tech Fluency', fields: ['technical_experience', 'ai_interests', 'ai_familiarity', 'ai_models_used', 'programming_languages'] },
    { id: 'portfolio', title: 'Portfolio & Social Presence', fields: ['has_projects', 'social_networks', 'help_amplify_products', 'public_testimonials_ok'] },
  ];

  const calculateProgress = () => {
    return Math.round((completedSections.size / sections.length) * 100);
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('lastActiveTab', activeTab);
  }, [activeTab]);

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
  };

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/user-login');
        return;
      }
      
      setUser(user);

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile) {
        setProfileData(prevData => ({
          ...prevData,
          ...profile,
          confirmPassword: '',
        }));
        
        const completed = new Set<string>();
        const unlocked = new Set<string>(['basic']);
        sections.forEach((section, index) => {
          const hasRequiredFields = section.fields.some(field => {
            const value = profile[field];
            return value && (Array.isArray(value) ? value.length > 0 : value !== '');
          });
          if (hasRequiredFields) {
            completed.add(section.id);
            // Unlock next tab if this one is completed
            if (index + 1 < sections.length) {
              unlocked.add(sections[index + 1].id);
            }
          }
        });
        setCompletedSections(completed);
        setUnlockedTabs(unlocked);
        
        // Set active tab to saved tab from localStorage or first incomplete section
        const savedTab = localStorage.getItem('lastActiveTab');
        if (savedTab && !completed.has(savedTab)) {
          setActiveTab(savedTab);
        }
      }

      const { data: devicesData } = await supabase
        .from('user_devices')
        .select('*')
        .eq('user_id', user.id);

      if (devicesData && devicesData.length > 0) {
        // Separate devices by type
        const mobileDevices = devicesData.filter(device => 
          device.device_type === 'Mobile/Tablet'
        );
        const desktopDevices = devicesData.filter(device => 
          device.device_type === 'Desktop/Laptop'
        );
        
        // Update profile data with the separated devices
        setProfileData(prevData => ({
          ...prevData,
          mobile_devices: mobileDevices,
          desktop_devices: desktopDevices
        }));
        
        // Keep the old devices state for backward compatibility
        setDevices(devicesData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const validateSection = (sectionId: string) => {
    const newErrors: Record<string, string> = {};
    
    switch (sectionId) {
      case 'basic':
        if (!profileData.first_name) newErrors.first_name = 'First name is required';
        else if (profileData.first_name.length < 3) newErrors.first_name = 'First name must be at least 3 characters';
        
        if (!profileData.last_name) newErrors.last_name = 'Last name is required';
        else if (profileData.last_name.length < 2) newErrors.last_name = 'Last name must be at least 2 characters';
        
        if (profileData.phone_number && !/^\+?[\d\s\-\(\)]+$/.test(profileData.phone_number)) {
          newErrors.phone_number = 'Please enter a valid phone number';
        }
        
        if (!profileData.age || profileData.age < 18 || profileData.age > 70) newErrors.age = 'Age must be between 18 and 70';
        if (!profileData.gender) newErrors.gender = 'Gender is required';
        if (!profileData.country) newErrors.country = 'Country is required';
        if (!profileData.timezone) newErrors.timezone = 'Timezone is required';
        break;
      
      case 'devices':
        if (!profileData.email_clients.length) newErrors.email_clients = 'At least one email client is required';
        
        // Validate streaming subscriptions
        if (!profileData.streaming_subscriptions || profileData.streaming_subscriptions.length === 0) {
          newErrors.streaming_subscriptions = 'At least one streaming subscription selection is required';
        }
        
        // Validate music subscriptions  
        if (!profileData.music_subscriptions || profileData.music_subscriptions.length === 0) {
          newErrors.music_subscriptions = 'At least one music subscription selection is required';
        }
        
        // Validate devices - at least one device type is required unless both are marked as "I don't have any"
        const hasMobileDevices = profileData.mobile_devices && profileData.mobile_devices.length > 0;
        const hasDesktopDevices = profileData.desktop_devices && profileData.desktop_devices.length > 0;
        const noMobileTablet = profileData.no_mobile_tablet;
        const noDesktopLaptop = profileData.no_desktop_laptop;
        
        if (!hasMobileDevices && !hasDesktopDevices && !noMobileTablet && !noDesktopLaptop) {
          newErrors.devices = 'At least one device must be added or select "I don\'t have any" for both categories';
        }
        
        if (!noMobileTablet && !hasMobileDevices) {
          newErrors.mobile_devices = 'At least one mobile/tablet device is required or select "I don\'t have any"';
        }
        
        if (!noDesktopLaptop && !hasDesktopDevices) {
          newErrors.desktop_devices = 'At least one desktop/laptop device is required or select "I don\'t have any"';
        }
        break;
      
      case 'education':
        if (!profileData.education_level) newErrors.education_level = 'Education level is required';
        
        // Check if primary_area_of_study is required based on education_level
        const requiresAreaOfStudy = ['Associate degree', 'Bachelor\'s degree', 'Master\'s degree', 'Doctorate degree', 'Professional degree', 'In grad school', 'In college'].includes(profileData.education_level);
        if (requiresAreaOfStudy && !profileData.primary_area_of_study) {
          newErrors.primary_area_of_study = 'Primary area of study is required for your education level';
        }
        
        if (!profileData.primary_work_role) newErrors.primary_work_role = 'Primary work role is required';
        if (!profileData.employment_industry) newErrors.employment_industry = 'Employment industry is required';
        if (!profileData.job_function) newErrors.job_function = 'Job function is required';
        if (!profileData.company_size) newErrors.company_size = 'Company size is required';
        break;
      
      case 'ai':
        if (!profileData.technical_experience) newErrors.technical_experience = 'Technical experience is required';
        if (!profileData.ai_interests.length) newErrors.ai_interests = 'At least one AI interest is required';
        if (!profileData.ai_familiarity) newErrors.ai_familiarity = 'AI familiarity is required';
        if (!profileData.ai_models_used.length) newErrors.ai_models_used = 'At least one AI model is required';
        if (!profileData.programming_languages.length) newErrors.programming_languages = 'At least one programming language is required';
        break;
      
      case 'portfolio':
        if (typeof profileData.has_projects !== 'boolean') newErrors.has_projects = 'Please select whether you have built projects before';
        if (profileData.has_projects && !profileData.portfolio_url) newErrors.portfolio_url = 'Portfolio URL is required when you have built projects';
        if (profileData.portfolio_url && !/^https?:\/\/.+/.test(profileData.portfolio_url)) newErrors.portfolio_url = 'Please enter a valid URL';
        if (!profileData.social_networks.length) newErrors.social_networks = 'At least one social network is required';
        if (!profileData.help_amplify_products.length) newErrors.help_amplify_products = 'Please select at least one option for how you would like to help amplify AI products';
        if (typeof profileData.public_testimonials_ok !== 'boolean') newErrors.public_testimonials_ok = 'Please select your preference for public testimonials';
        if (profileData.discord_username && !/^[a-zA-Z0-9._#-]+$/.test(profileData.discord_username)) newErrors.discord_username = 'Please enter a valid Discord username';
        if (profileData.linkedin_url && !/^https?:\/\/.+/.test(profileData.linkedin_url)) newErrors.linkedin_url = 'Please enter a valid LinkedIn URL';
        if (profileData.twitter_url && !/^https?:\/\/.+/.test(profileData.twitter_url)) newErrors.twitter_url = 'Please enter a valid X (Twitter) URL';
        break;
    }
    
    setErrors(newErrors);
    
    // Auto-dismiss errors after 2 seconds
    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => setErrors({}), 2000);
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (sectionId: string) => {
    if (!validateSection(sectionId)) return;

    setIsLoading(true);
    setSuccessMessage('');
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Prepare update data by mapping to actual database fields
      let updateData: any = {
        user_id: user.id,
        profile_pic_url: profileData.profile_pic_url,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        phone_number: profileData.phone_number,
        age: profileData.age,
        gender: profileData.gender,
        country: profileData.country,
        state: profileData.state,
        zip_code: profileData.zip_code,
        timezone: profileData.timezone,
        education_level: profileData.education_level,
        primary_area_of_study: profileData.primary_area_of_study,
        household_income: profileData.household_income,
        is_parent: profileData.is_parent,
        primary_work_role: profileData.primary_work_role,
        employment_industry: profileData.employment_industry,
        job_function: profileData.job_function,
        company_size: profileData.company_size,
        technical_experience: profileData.technical_experience,
        ai_interests: profileData.ai_interests,
        ai_familiarity: profileData.ai_familiarity,
        ai_models_used: profileData.ai_models_used,
        programming_languages: profileData.programming_languages,
        specific_skills: profileData.specific_skills,
        ai_tools_discovery: profileData.ai_tools_discovery,
        has_projects: profileData.has_projects,
        portfolio_url: profileData.portfolio_url,
        social_networks: profileData.social_networks,
        public_testimonials_ok: profileData.public_testimonials_ok,
        linkedin_url: profileData.linkedin_url,
        twitter_url: profileData.twitter_url,
        languages_spoken: profileData.languages_spoken,
        email_clients: profileData.email_clients,
        cell_phone_network: profileData.cell_phone_network,
        streaming_subscriptions: profileData.streaming_subscriptions,
        music_subscriptions: profileData.music_subscriptions,
        social_media_hours: profileData.social_media_hours,
      };
      
      if (sectionId === 'basic' && profileData.password_hash && profileData.confirmPassword) {
        if (profileData.password_hash !== profileData.confirmPassword) {
          setErrors({ confirmPassword: 'Passwords do not match' });
          setIsLoading(false);
          return;
        }
        const hashedPassword = await bcryptjs.hash(profileData.password_hash, 10);
        updateData.password_hash = hashedPassword;
      }

      // Check if profile exists first
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      let result;
      if (existingProfile) {
        // Update existing profile
        result = await supabase
          .from('user_profiles')
          .update(updateData)
          .eq('user_id', user.id);
      } else {
        // Insert new profile
        result = await supabase
          .from('user_profiles')
          .insert({ ...updateData, user_id: user.id });
      }

      const { error } = result;

      if (error) {
        console.error('Profile update error:', error);
        throw error;
      }

      if (sectionId === 'devices') {
        // Collect all devices from mobile_devices and desktop_devices
        const allDevices = [
          ...(profileData.mobile_devices || []),
          ...(profileData.desktop_devices || [])
        ];

        // Debug device saving
        console.log('Saving devices - all devices:', allDevices);
        console.log('Mobile devices:', profileData.mobile_devices);
        console.log('Desktop devices:', profileData.desktop_devices);

        // Filter valid devices and prepare for upsert
        const validDevices = allDevices.filter(device => 
          device.device_type && device.operating_system && device.manufacturer
        );
        
        if (validDevices.length > 0) {
          // First, get existing devices to determine which ones to update vs insert
          const { data: existingDevices } = await supabase
            .from('user_devices')
            .select('*')
            .eq('user_id', user.id);
          
          const existingDeviceIds = new Set(existingDevices?.map(d => d.id) || []);
          
          // First delete all existing devices to prevent duplicates
          const { error: deleteAllError } = await supabase
            .from('user_devices')
            .delete()
            .eq('user_id', user.id);
            
          if (deleteAllError) {
            console.error('Device cleanup error:', deleteAllError);
            throw deleteAllError;
          }
          
          // Then insert all valid devices fresh
          for (const device of validDevices) {
            const deviceData = {
              user_id: user.id,
              device_type: device.device_type,
              operating_system: device.operating_system,
              manufacturer: device.manufacturer,
              model: device.model || ''
            };
            
            const { error: insertError } = await supabase
              .from('user_devices')
              .insert(deviceData);
              
            if (insertError) {
              console.error('Device insertion error:', insertError);
              throw insertError;
            }
          }
          
        } else {
          // No valid devices, delete all existing ones
          const { error: deleteError } = await supabase
            .from('user_devices')
            .delete()
            .eq('user_id', user.id);

          if (deleteError) {
            console.error('Device deletion error:', deleteError);
            throw deleteError;
          }
        }
      }

      setCompletedSections(prev => new Set([...prev, sectionId]));
      
      // Save current tab to localStorage
      localStorage.setItem('lastActiveTab', sectionId);
      
      // Unlock next tab
      const currentIndex = sections.findIndex(s => s.id === sectionId);
      if (currentIndex !== -1 && currentIndex + 1 < sections.length) {
        const nextTabId = sections[currentIndex + 1].id;
        setUnlockedTabs(prev => new Set([...prev, nextTabId]));
        
        // Auto-advance to next tab
        setTimeout(() => {
          setActiveTab(nextTabId);
          localStorage.setItem('lastActiveTab', nextTabId);
        }, 500);
      }
      
      setSuccessMessage('Saved successfully!');
      setTimeout(() => setSuccessMessage(''), 2000);
      
      // Only navigate to projects if this is the last section
      if (sectionId === 'portfolio') {
        // Clear localStorage tab tracking since profile is complete
        localStorage.removeItem('lastActiveTab');
        
        // Navigate to projects page after a short delay
        setTimeout(() => {
          navigate('/user-projects');
        }, 1500);
      }
      
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = async () => {
    // Validate the portfolio section first
    if (!validateSection('portfolio')) {
      toast({
        title: 'Validation Error',
        description: 'Please complete all required fields in the Portfolio & Social Presence section.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Save all profile data one final time
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Prepare final update with all data
      const updateData: any = {
        user_id: user.id,
        profile_pic_url: profileData.profile_pic_url,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        phone_number: profileData.phone_number,
        age: profileData.age,
        gender: profileData.gender,
        country: profileData.country,
        state: profileData.state,
        zip_code: profileData.zip_code,
        timezone: profileData.timezone,
        education_level: profileData.education_level,
        primary_area_of_study: profileData.primary_area_of_study,
        household_income: profileData.household_income,
        is_parent: profileData.is_parent,
        primary_work_role: profileData.primary_work_role,
        employment_industry: profileData.employment_industry,
        job_function: profileData.job_function,
        company_size: profileData.company_size,
        technical_experience: profileData.technical_experience,
        ai_interests: profileData.ai_interests,
        ai_familiarity: profileData.ai_familiarity,
        ai_models_used: profileData.ai_models_used,
        programming_languages: profileData.programming_languages,
        specific_skills: profileData.specific_skills,
        ai_tools_discovery: profileData.ai_tools_discovery,
        has_projects: profileData.has_projects,
        portfolio_url: profileData.portfolio_url,
        social_networks: profileData.social_networks,
        public_testimonials_ok: profileData.public_testimonials_ok,
        linkedin_url: profileData.linkedin_url,
        twitter_url: profileData.twitter_url,
        languages_spoken: profileData.languages_spoken,
        email_clients: profileData.email_clients,
        cell_phone_network: profileData.cell_phone_network,
        streaming_subscriptions: profileData.streaming_subscriptions,
        music_subscriptions: profileData.music_subscriptions,
        social_media_hours: profileData.social_media_hours,
      };

      // Check if profile exists first
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      let result;
      if (existingProfile) {
        // Update existing profile
        result = await supabase
          .from('user_profiles')
          .update(updateData)
          .eq('user_id', user.id);
      } else {
        // Insert new profile
        result = await supabase
          .from('user_profiles')
          .insert({ ...updateData, user_id: user.id });
      }

      const { error } = result;

      if (error) {
        console.error('Profile update error:', error);
        throw error;
      }

      // Also save devices when finishing profile
      const allDevices = [
        ...(profileData.mobile_devices || []),
        ...(profileData.desktop_devices || [])
      ];

      const validDevices = allDevices.filter(device => 
        device.device_type && device.operating_system && device.manufacturer
      );
      
      if (validDevices.length > 0) {
        console.log('Saving devices during finish:', validDevices);
        
        // First delete all existing devices to prevent duplicates  
        const { error: deleteAllError } = await supabase
          .from('user_devices')
          .delete()
          .eq('user_id', user.id);
          
        if (deleteAllError) {
          console.error('Device cleanup error during finish:', deleteAllError);
          throw deleteAllError;
        }
        
        // Then insert all valid devices fresh
        for (const device of validDevices) {
          const deviceData = {
            user_id: user.id,
            device_type: device.device_type,
            operating_system: device.operating_system,
            manufacturer: device.manufacturer,
            model: device.model || ''
          };
          
          const { error: insertError } = await supabase
            .from('user_devices')
            .insert(deviceData);
            
          if (insertError) {
            console.error('Device insertion error during finish:', insertError);
            throw insertError;
          }
        }
      }

      // Mark all sections as completed
      setCompletedSections(new Set(sections.map(s => s.id)));
      
      toast({
        title: 'Success!',
        description: 'Profile setup completed successfully.',
      });
      
      // Navigate after a short delay
      setTimeout(() => {
        navigate('/user-projects');
      }, 1000);
      
    } catch (error) {
      console.error('Error finishing profile:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addDevice = () => {
    setDevices([...devices, { device_type: '', operating_system: '', manufacturer: '', model: '' }]);
  };

  const removeDevice = (index: number) => {
    setDevices(devices.filter((_, i) => i !== index));
  };

  const updateDevice = (index: number, field: string, value: string) => {
    const updatedDevices = [...devices];
    updatedDevices[index] = { ...updatedDevices[index], [field]: value };
    setDevices(updatedDevices);
  };

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/profile.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(fileName, file, { 
          upsert: true,
          contentType: file.type 
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        // Fallback to base64 for now if storage fails
        const reader = new FileReader();
        reader.onload = (e) => {
          setProfileData({ ...profileData, profile_pic_url: e.target?.result as string });
        };
        reader.readAsDataURL(file);
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('profiles')
          .getPublicUrl(fileName);
        setProfileData({ ...profileData, profile_pic_url: publicUrl });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      // Fallback to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData({ ...profileData, profile_pic_url: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleLogoClick = () => {
    navigate('/user-projects');
  };

  const handleLogout = async () => {
    try {
      localStorage.setItem('lastActiveTab', activeTab);
      await supabase.auth.signOut();
      navigate('/user-login');
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 font-inter">
      <InternalHeader user={user} isProfileComplete={completedSections.size === sections.length} />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 space-y-6">

        <div className="bg-card rounded-lg p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Profile completion</h2>
            <span className="text-sm text-muted-foreground">
              {completedSections.size} / {sections.length} steps complete
            </span>
          </div>
          
          <Progress value={calculateProgress()} className="h-4" showPercentage={true} />
          
          <p className="text-sm text-muted-foreground">
            Complete your profile to get more project invitations
          </p>
        </div>

        {errors.tabLocked && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-2 rounded-md text-sm">
            {errors.tabLocked}
          </div>
        )}

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
          <TabsList className={`w-full h-auto bg-background border border-border rounded-2xl p-2 shadow-lg ${isMobile ? 'flex flex-col space-y-2' : 'grid grid-cols-5 gap-2'}`}>
            {sections.map((section) => (
              <TabsTrigger
                key={section.id}
                value={section.id}
                className={`
                  ${isMobile ? 'w-full justify-start h-12' : 'flex flex-col items-center justify-center h-14'} 
                  px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 ease-out select-none
                  ${!unlockedTabs.has(section.id) 
                    ? 'opacity-50 cursor-not-allowed text-muted-foreground bg-muted/20' 
                    : completedSections.has(section.id)
                      ? 'data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-turquoise data-[state=active]:to-sky-blue data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 data-[state=active]:scale-[1.02] data-[state=inactive]:text-primary data-[state=inactive]:bg-primary/10 data-[state=inactive]:hover:text-primary data-[state=inactive]:hover:bg-primary/20 data-[state=inactive]:hover:scale-[1.01] data-[state=inactive]:border data-[state=inactive]:border-primary/20 dark:data-[state=inactive]:text-primary dark:data-[state=inactive]:bg-primary/10 dark:data-[state=inactive]:border-primary/20 dark:data-[state=inactive]:hover:bg-primary/20'
                      : 'data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-turquoise data-[state=active]:to-sky-blue data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 data-[state=active]:scale-[1.02] data-[state=inactive]:text-muted-foreground data-[state=inactive]:bg-transparent data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:bg-muted/50 data-[state=inactive]:hover:scale-[1.01]'
                  }
                `}
                disabled={!unlockedTabs.has(section.id)}
              >
                <div className={`flex items-center ${isMobile ? 'space-x-2' : 'flex-col space-y-1'} w-full`}>
                  <span className={`font-bold leading-tight text-center ${isMobile ? 'text-sm' : 'text-xs'} px-1`}>
                    {section.title}
                  </span>
                  {completedSections.has(section.id) && (
                    <Check className="h-3 w-3 text-current flex-shrink-0" />
                  )}
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="basic" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Basic Profile</CardTitle>
                <CardDescription>Your basic information and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-bold">Upload a profile picture (Optional)</Label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                      {profileData.profile_pic_url ? (
                        <img 
                          src={profileData.profile_pic_url} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Upload className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                      className="hidden"
                      id="profile-picture"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => document.getElementById('profile-picture')?.click()}
                      disabled={uploadingImage}
                    >
                      {uploadingImage ? 'Uploading...' : 'Choose Image'}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-bold">First Name <Star className="inline h-3 w-3 text-red-500 ml-1" /></Label>
                    <Input
                      value={profileData.first_name}
                      onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
                      className={errors.first_name ? 'border-red-500' : ''}
                    />
                    {errors.first_name && (
                      <p className="text-sm text-red-500">{errors.first_name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">Last Name <Star className="inline h-3 w-3 text-red-500 ml-1" /></Label>
                    <Input
                      value={profileData.last_name}
                      onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}
                      className={errors.last_name ? 'border-red-500' : ''}
                    />
                    {errors.last_name && (
                      <p className="text-sm text-red-500">{errors.last_name}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-bold">Phone Number</Label>
                  <Input
                    value={profileData.phone_number}
                    onChange={(e) => setProfileData({...profileData, phone_number: e.target.value})}
                    className={errors.phone_number ? 'border-red-500' : ''}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone_number && (
                    <p className="text-sm text-red-500">{errors.phone_number}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-bold">Age <Star className="inline h-3 w-3 text-red-500 ml-1" /></Label>
                    <Select 
                      value={profileData.age.toString()} 
                      onValueChange={(value) => setProfileData({...profileData, age: parseInt(value)})}
                    >
                      <SelectTrigger className={errors.age ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select age" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 53}, (_, i) => i + 18).map(age => (
                          <SelectItem key={age} value={age.toString()}>{age}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.age && (
                      <p className="text-sm text-red-500">{errors.age}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">Gender <Star className="inline h-3 w-3 text-red-500 ml-1" /></Label>
                    <Select 
                      value={profileData.gender} 
                      onValueChange={(value) => setProfileData({...profileData, gender: value})}
                    >
                      <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="non-binary">Non-binary</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && (
                      <p className="text-sm text-red-500">{errors.gender}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-bold">Country <Star className="inline h-3 w-3 text-red-500 ml-1" /></Label>
                  <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={countryOpen}
                        className={`w-full justify-between hover:bg-background hover:text-foreground ${errors.country ? 'border-red-500' : ''}`}
                      >
                        {profileData.country ? countries.find(c => c.code === profileData.country)?.name : "Select country..."}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search country..." />
                        <CommandList>
                          <CommandEmpty>No country found.</CommandEmpty>
                          <CommandGroup>
                            {countries.map((country) => (
                               <CommandItem
                                 key={country.code}
                                 value={country.name}
                                 onSelect={() => {
                                   setProfileData({...profileData, country: country.code});
                                   setCountryOpen(false);
                                 }}
                                 className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
                               >
                                 {country.name}
                               </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {errors.country && (
                    <p className="text-sm text-red-500">{errors.country}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="font-bold">Timezone <Star className="inline h-3 w-3 text-red-500 ml-1" /></Label>
                  <Popover open={timezoneOpen} onOpenChange={setTimezoneOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={timezoneOpen}
                        className={`w-full justify-between hover:bg-background hover:text-foreground ${errors.timezone ? 'border-red-500' : ''}`}
                      >
                        {profileData.timezone ? timezones.find(t => t.value === profileData.timezone)?.label : "Select timezone..."}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search timezone..." />
                        <CommandList>
                          <CommandEmpty>No timezone found.</CommandEmpty>
                          <CommandGroup>
                            {timezones.map((timezone) => (
                               <CommandItem
                                 key={timezone.value}
                                 value={timezone.label}
                                 onSelect={() => {
                                   setProfileData({...profileData, timezone: timezone.value});
                                   setTimezoneOpen(false);
                                 }}
                                 className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
                               >
                                 {timezone.label}
                               </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {errors.timezone && (
                    <p className="text-sm text-red-500">{errors.timezone}</p>
                  )}
                </div>

                {successMessage && (
                  <p className="text-sm text-green-600 font-medium animate-fade-in">{successMessage}</p>
                )}

                 <Button 
                   onClick={() => handleSave('basic')} 
                   disabled={isLoading}
                   className="w-full md:w-auto transition-all duration-200 hover:scale-105"
                 >
                   {isLoading ? 'Saving...' : 'Save'}
                 </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Devices & Product Usage</CardTitle>
                <CardDescription>Information about your devices and product usage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Mobile and Tablet Section */}
                <div className="space-y-4">
                   <h3 className="text-lg font-medium">Mobile and Tablet <Star className="inline h-3 w-3 text-red-500 ml-1" /></h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="no_mobile_tablet"
                      checked={profileData.no_mobile_tablet || false}
                      onCheckedChange={(checked) => {
                        setProfileData({
                          ...profileData,
                          no_mobile_tablet: !!checked,
                          mobile_devices: checked ? [] : profileData.mobile_devices
                        });
                        if (checked) {
                          setSelectedMobileIndex(null);
                          setEditingMobileDevice(null);
                        }
                      }}
                    />
                    <Label htmlFor="no_mobile_tablet" className="text-sm font-normal">
                      I don't have any
                    </Label>
                  </div>
                  
                  {!profileData.no_mobile_tablet && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       <div className="space-y-2">
                         <div 
                           className="border rounded-lg overflow-hidden"
                           style={{ 
                             height: `${Math.max(1, (profileData.mobile_devices || []).length || 1) * 48 + 2}px` 
                           }}
                         >
                           <div className="divide-y divide-border">
                             {(profileData.mobile_devices || []).length > 0 ? (
                               (profileData.mobile_devices || []).map((device, index) => (
                                 <div 
                                   key={index} 
                                   className={`h-12 px-3 py-2 text-sm cursor-pointer transition-colors border-l-2 hover:bg-muted/50 ${
                                     selectedMobileIndex === index 
                                       ? 'bg-muted border-l-primary' 
                                       : 'border-l-transparent'
                                   }`}
                                   onClick={() => setSelectedMobileIndex(index)}
                                 >
                                   <div className="font-medium truncate">{device.manufacturer} {device.model}</div>
                                   <div className="text-muted-foreground text-xs truncate">{device.operating_system}</div>
                                 </div>
                               ))
                             ) : (
                               <div className="h-12 px-3 py-2 text-muted-foreground text-sm flex items-center justify-center">
                                 No devices added yet
                               </div>
                             )}
                           </div>
                         </div>
                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingMobileDevice({})}
                          >
                            Add
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (selectedMobileIndex !== null) {
                                const devices = [...(profileData.mobile_devices || [])];
                                devices.splice(selectedMobileIndex, 1);
                                setProfileData({...profileData, mobile_devices: devices});
                                setSelectedMobileIndex(null);
                              }
                            }}
                            disabled={selectedMobileIndex === null}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                         {editingMobileDevice && (
                           <div className="space-y-4 border rounded-lg p-4 animate-fade-in">
                              <div>
                                <Label htmlFor="mobile_manufacturer" className="font-bold">Handset Manufacturer *</Label>
                                <Select
                                  value={editingMobileDevice.manufacturer || ''}
                                  onValueChange={(value) => setEditingMobileDevice({...editingMobileDevice, manufacturer: value})}
                                >
                                  <SelectTrigger className="mt-2">
                                    <SelectValue placeholder="Select manufacturer" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Apple">Apple</SelectItem>
                                    <SelectItem value="Samsung">Samsung</SelectItem>
                                    <SelectItem value="Google">Google</SelectItem>
                                    <SelectItem value="OnePlus">OnePlus</SelectItem>
                                    <SelectItem value="Xiaomi">Xiaomi</SelectItem>
                                    <SelectItem value="Huawei">Huawei</SelectItem>
                                    <SelectItem value="LG">LG</SelectItem>
                                    <SelectItem value="Sony">Sony</SelectItem>
                                    <SelectItem value="Motorola">Motorola</SelectItem>
                                    <SelectItem value="Nokia">Nokia</SelectItem>
                                    <SelectItem value="Oppo">Oppo</SelectItem>
                                    <SelectItem value="Vivo">Vivo</SelectItem>
                                    <SelectItem value="Realme">Realme</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            
                             <div>
                               <Label htmlFor="mobile_model" className="font-bold">Handset Model *</Label>
                               <Input
                                 id="mobile_model"
                                 value={editingMobileDevice.model || ''}
                                 onChange={(e) => setEditingMobileDevice({...editingMobileDevice, model: e.target.value})}
                                 placeholder="Enter exact model"
                                 className="mt-2"
                               />
                             </div>
                             
                              <div>
                                <Label htmlFor="mobile_os" className="font-bold">Handset Operating System *</Label>
                                <Select
                                  value={editingMobileDevice.operating_system || ''}
                                  onValueChange={(value) => setEditingMobileDevice({...editingMobileDevice, operating_system: value})}
                                >
                                  <SelectTrigger className="mt-2">
                                    <SelectValue placeholder="Select operating system" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Android">Android</SelectItem>
                                    <SelectItem value="iOS">iOS</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            
                             <div className="flex space-x-2">
                               <Button
                                 type="button"
                                 size="sm"
                                 onClick={() => {
                                   if (editingMobileDevice.manufacturer && editingMobileDevice.model && editingMobileDevice.operating_system) {
                                     const devices = [...(profileData.mobile_devices || [])];
                                     devices.push({
                                       ...editingMobileDevice,
                                       device_type: 'Mobile/Tablet'
                                     });
                                     setProfileData({...profileData, mobile_devices: devices});
                                     setEditingMobileDevice(null);
                                   }
                                 }}
                                 disabled={!editingMobileDevice.manufacturer || !editingMobileDevice.model || !editingMobileDevice.operating_system}
                                 className="transition-all duration-200 hover:scale-105"
                               >
                                 Save Device
                               </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingMobileDevice(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Desktop and Laptop Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Desktop and Laptop <Star className="inline h-3 w-3 text-red-500 ml-1" /></h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="no_desktop_laptop"
                      checked={profileData.no_desktop_laptop || false}
                      onCheckedChange={(checked) => {
                        setProfileData({
                          ...profileData,
                          no_desktop_laptop: !!checked,
                          desktop_devices: checked ? [] : profileData.desktop_devices
                        });
                        if (checked) {
                          setSelectedDesktopIndex(null);
                          setEditingDesktopDevice(null);
                        }
                      }}
                    />
                    <Label htmlFor="no_desktop_laptop" className="text-sm font-normal">
                      I don't have any
                    </Label>
                  </div>
                  
                  {!profileData.no_desktop_laptop && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       <div className="space-y-2">
                         <div 
                           className="border rounded-lg overflow-hidden"
                           style={{ 
                             height: `${Math.max(1, (profileData.desktop_devices || []).length || 1) * 48 + 2}px` 
                           }}
                         >
                           <div className="divide-y divide-border">
                             {(profileData.desktop_devices || []).length > 0 ? (
                               (profileData.desktop_devices || []).map((device, index) => (
                                 <div 
                                   key={index} 
                                   className={`h-12 px-3 py-2 text-sm cursor-pointer transition-colors border-l-2 hover:bg-muted/50 ${
                                     selectedDesktopIndex === index 
                                       ? 'bg-muted border-l-primary' 
                                       : 'border-l-transparent'
                                   }`}
                                   onClick={() => setSelectedDesktopIndex(index)}
                                 >
                                   <div className="font-medium truncate">{device.model}</div>
                                   <div className="text-muted-foreground text-xs truncate">{device.operating_system}</div>
                                 </div>
                               ))
                             ) : (
                               <div className="h-12 px-3 py-2 text-muted-foreground text-sm flex items-center justify-center">
                                 No devices added yet
                               </div>
                             )}
                           </div>
                         </div>
                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingDesktopDevice({})}
                          >
                            Add
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (selectedDesktopIndex !== null) {
                                const devices = [...(profileData.desktop_devices || [])];
                                devices.splice(selectedDesktopIndex, 1);
                                setProfileData({...profileData, desktop_devices: devices});
                                setSelectedDesktopIndex(null);
                              }
                            }}
                            disabled={selectedDesktopIndex === null}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      
                       <div className="space-y-4">
                         {editingDesktopDevice && (
                           <div className="space-y-4 border rounded-lg p-4 animate-fade-in">
                              <div>
                                <Label htmlFor="desktop_manufacturer" className="font-bold">Manufacturer *</Label>
                                <Select
                                  value={editingDesktopDevice.manufacturer || ''}
                                  onValueChange={(value) => setEditingDesktopDevice({...editingDesktopDevice, manufacturer: value})}
                                >
                                  <SelectTrigger className="mt-2">
                                    <SelectValue placeholder="Select manufacturer" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Apple">Apple</SelectItem>
                                    <SelectItem value="Dell">Dell</SelectItem>
                                    <SelectItem value="HP">HP</SelectItem>
                                    <SelectItem value="Lenovo">Lenovo</SelectItem>
                                    <SelectItem value="ASUS">ASUS</SelectItem>
                                    <SelectItem value="Acer">Acer</SelectItem>
                                    <SelectItem value="Microsoft">Microsoft</SelectItem>
                                    <SelectItem value="MSI">MSI</SelectItem>
                                    <SelectItem value="Alienware">Alienware</SelectItem>
                                    <SelectItem value="Razer">Razer</SelectItem>
                                    <SelectItem value="Custom Built">Custom Built</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label htmlFor="desktop_model" className="font-bold">Device Model *</Label>
                                <Input
                                  id="desktop_model"
                                  value={editingDesktopDevice.model || ''}
                                  onChange={(e) => setEditingDesktopDevice({...editingDesktopDevice, model: e.target.value})}
                                  placeholder="Enter exact model"
                                  className="mt-2"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="desktop_os" className="font-bold">Operating System *</Label>
                                <Select
                                  value={editingDesktopDevice.operating_system || ''}
                                  onValueChange={(value) => setEditingDesktopDevice({...editingDesktopDevice, operating_system: value})}
                                >
                                  <SelectTrigger className="mt-2">
                                    <SelectValue placeholder="Select operating system" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Windows">Windows</SelectItem>
                                    <SelectItem value="macOS">macOS</SelectItem>
                                    <SelectItem value="Linux">Linux</SelectItem>
                                    <SelectItem value="Chrome OS">Chrome OS</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                             
                             <div className="flex space-x-2">
                               <Button
                                 type="button"
                                 size="sm"
                                 onClick={() => {
                                   if (editingDesktopDevice.manufacturer && editingDesktopDevice.model && editingDesktopDevice.operating_system) {
                                     const devices = [...(profileData.desktop_devices || [])];
                                     devices.push({
                                       ...editingDesktopDevice,
                                       device_type: 'Desktop/Laptop'
                                     });
                                     setProfileData({...profileData, desktop_devices: devices});
                                     setEditingDesktopDevice(null);
                                   }
                                 }}
                                 disabled={!editingDesktopDevice.manufacturer || !editingDesktopDevice.model || !editingDesktopDevice.operating_system}
                                 className="transition-all duration-200 hover:scale-105"
                               >
                                 Save Device
                               </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingDesktopDevice(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Email Client Section */}
                 <div className="space-y-2">
                   <Label className="font-bold">Which email client(s) do you use for personal use? <Star className="inline h-3 w-3 text-red-500 ml-1" /></Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Gmail', 'Outlook', 'Yahoo', 'AOL', 'Hotmail', 'Apple Mail'].map(client => (
                      <div key={client} className="flex items-center space-x-2">
                        <Checkbox
                          id={client}
                          checked={profileData.email_clients.includes(client)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setProfileData({
                                ...profileData,
                                email_clients: [...profileData.email_clients, client]
                              });
                            } else {
                              setProfileData({
                                ...profileData,
                                email_clients: profileData.email_clients.filter(c => c !== client)
                              });
                            }
                          }}
                        />
                        <Label htmlFor={client} className="text-sm">{client}</Label>
                      </div>
                    ))}
                  </div>
                  {errors.email_clients && (
                    <p className="text-sm text-red-500">{errors.email_clients}</p>
                  )}
                </div>

                {/* Streaming and Music Subscriptions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <Label className="font-bold">Which streaming television subscriptions do you have? <Star className="inline h-3 w-3 text-red-500 ml-1" /></Label>
                    <div className="mt-2 space-y-2">
                      {['None', 'Netflix', 'Prime Video', 'Max', 'Paramount+', 'Disney+', 'Apple TV', 'Peacock'].map((service) => (
                        <div key={service} className="flex items-center space-x-2">
                          <Checkbox
                            id={`streaming_${service}`}
                            checked={profileData.streaming_subscriptions?.includes(service) || false}
                            onCheckedChange={(checked) => {
                              const current = profileData.streaming_subscriptions || [];
                              if (checked) {
                                if (service === 'None') {
                                  setProfileData({
                                    ...profileData,
                                    streaming_subscriptions: ['None']
                                  });
                                } else {
                                  const filtered = current.filter(s => s !== 'None');
                                  setProfileData({
                                    ...profileData,
                                    streaming_subscriptions: [...filtered, service]
                                  });
                                }
                              } else {
                                setProfileData({
                                  ...profileData,
                                  streaming_subscriptions: current.filter(s => s !== service)
                                });
                              }
                            }}
                          />
                          <Label htmlFor={`streaming_${service}`} className="text-sm font-normal">
                            {service}
                          </Label>
                        </div>
                      ))}
                     </div>
                     {errors.streaming_subscriptions && (
                       <p className="text-sm text-red-500">{errors.streaming_subscriptions}</p>
                     )}
                   </div>
                  
                   <div>
                     <Label className="font-bold">Which music subscriptions do you have? <Star className="inline h-3 w-3 text-red-500 ml-1" /></Label>
                    <div className="mt-2 space-y-2">
                      {['None', 'Spotify', 'Apple Music', 'Amazon Music', 'Tidal', 'Pandora', 'SoundCloud', 'YouTube Music'].map((service) => (
                        <div key={service} className="flex items-center space-x-2">
                          <Checkbox
                            id={`music_${service}`}
                            checked={profileData.music_subscriptions?.includes(service) || false}
                            onCheckedChange={(checked) => {
                              const current = profileData.music_subscriptions || [];
                              if (checked) {
                                if (service === 'None') {
                                  setProfileData({
                                    ...profileData,
                                    music_subscriptions: ['None']
                                  });
                                } else {
                                  const filtered = current.filter(s => s !== 'None');
                                  setProfileData({
                                    ...profileData,
                                    music_subscriptions: [...filtered, service]
                                  });
                                }
                              } else {
                                setProfileData({
                                  ...profileData,
                                  music_subscriptions: current.filter(s => s !== service)
                                });
                              }
                            }}
                          />
                          <Label htmlFor={`music_${service}`} className="text-sm font-normal">
                            {service}
                          </Label>
                        </div>
                      ))}
                     </div>
                     {errors.music_subscriptions && (
                       <p className="text-sm text-red-500">{errors.music_subscriptions}</p>
                     )}
                   </div>
                 </div>
 
                 {/* Device validation errors */}
                 {errors.devices && (
                   <p className="text-sm text-red-500">{errors.devices}</p>
                 )}
                 {errors.mobile_devices && (
                   <p className="text-sm text-red-500">{errors.mobile_devices}</p>
                 )}
                 {errors.desktop_devices && (
                   <p className="text-sm text-red-500">{errors.desktop_devices}</p>
                 )}

                {successMessage && (
                  <p className="text-sm text-green-600 font-medium animate-fade-in">{successMessage}</p>
                )}

                 <Button 
                   onClick={() => handleSave('devices')} 
                   disabled={isLoading}
                   className="w-full md:w-auto transition-all duration-200 hover:scale-105"
                 >
                   {isLoading ? 'Saving...' : 'Save'}
                 </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Education & Work</CardTitle>
                <CardDescription>Your educational background and work experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-bold">Education Level <Star className="inline h-3 w-3 text-red-500 ml-1" /></Label>
                  <Select 
                    value={profileData.education_level} 
                    onValueChange={(value) => setProfileData({...profileData, education_level: value})}
                  >
                    <SelectTrigger className={errors.education_level ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select your education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Associate degree">Associate degree</SelectItem>
                      <SelectItem value="Bachelor's degree">Bachelor's degree</SelectItem>
                      <SelectItem value="Master's degree">Master's degree</SelectItem>
                      <SelectItem value="Doctorate degree">Doctorate degree</SelectItem>
                      <SelectItem value="Professional degree">Professional degree</SelectItem>
                      <SelectItem value="In grad school">In grad school</SelectItem>
                      <SelectItem value="In college">In college</SelectItem>
                      <SelectItem value="In high school">In high school</SelectItem>
                      <SelectItem value="High school graduate">High school graduate</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.education_level && (
                    <p className="text-sm text-red-500">{errors.education_level}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="font-bold">If you attended college, what was your primary area of study for your degree? <Star className="inline h-3 w-3 text-red-500 ml-1" /></Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={`w-full justify-between ${errors.primary_area_of_study ? 'border-red-500' : ''}`}
                      >
                        {profileData.primary_area_of_study || 'Select your primary area of study'}
                        <svg
                          className="ml-2 h-4 w-4 shrink-0 opacity-50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search area of study..." />
                        <CommandList>
                          <CommandEmpty>No area of study found.</CommandEmpty>
                          <CommandGroup>
                            {[
                              'Agriculture', 'Architecture', 'Arts & Humanities', 'Business', 'Computer Science', 
                              'Engineering', 'Health Sciences', 'Law', 'Natural Sciences', 'Social Sciences',
                              'Education', 'Communications', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
                              'Psychology', 'Political Science', 'Economics', 'History', 'Literature',
                              'Philosophy', 'Fine Arts', 'Music', 'Theater', 'Film Studies', 'Journalism',
                              'Not applicable', 'Other'
                            ].map((area) => (
                               <CommandItem
                                 key={area}
                                 value={area}
                                 onSelect={(currentValue) => {
                                   setProfileData({...profileData, primary_area_of_study: currentValue});
                                 }}
                                 className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
                               >
                                 {area}
                               </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {errors.primary_area_of_study && (
                    <p className="text-sm text-red-500">{errors.primary_area_of_study}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="font-bold">Household Income</Label>
                  <Select 
                    value={profileData.household_income || ''} 
                    onValueChange={(value) => setProfileData({...profileData, household_income: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your household income (Optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="$0 – $15,000">$0 – $15,000</SelectItem>
                      <SelectItem value="$15,000 – $30,000">$15,000 – $30,000</SelectItem>
                      <SelectItem value="$30,000 – $45,000">$30,000 – $45,000</SelectItem>
                      <SelectItem value="$45,000 – $60,000">$45,000 – $60,000</SelectItem>
                      <SelectItem value="$60,000 – $75,000">$60,000 – $75,000</SelectItem>
                      <SelectItem value="$75,000 – $90,000">$75,000 – $90,000</SelectItem>
                      <SelectItem value="$90,000 – $105,000">$90,000 – $105,000</SelectItem>
                      <SelectItem value="$105,000 – $120,000">$105,000 – $120,000</SelectItem>
                      <SelectItem value="$120,000 – $135,000">$120,000 – $135,000</SelectItem>
                      <SelectItem value="$135,000 – $150,000">$135,000 – $150,000</SelectItem>
                      <SelectItem value="$150,000+">$150,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-bold">How would you classify your primary work role? <Star className="inline h-3 w-3 text-red-500 ml-1" /></Label>
                  <Select 
                    value={profileData.primary_work_role} 
                    onValueChange={(value) => setProfileData({...profileData, primary_work_role: value})}
                  >
                    <SelectTrigger className={errors.primary_work_role ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select your primary work role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Unemployed">Unemployed</SelectItem>
                      <SelectItem value="Founder or Entrepreneur">Founder or Entrepreneur</SelectItem>
                      <SelectItem value="Small Business Owner">Small Business Owner</SelectItem>
                      <SelectItem value="Active Military">Active Military</SelectItem>
                      <SelectItem value="Salaried Employee">Salaried Employee</SelectItem>
                      <SelectItem value="Independent Contractor">Independent Contractor</SelectItem>
                      <SelectItem value="Gig Worker">Gig Worker</SelectItem>
                      <SelectItem value="Homemaker">Homemaker</SelectItem>
                      <SelectItem value="Mostly Volunteer">Mostly Volunteer</SelectItem>
                      <SelectItem value="Semi-Retired">Semi-Retired</SelectItem>
                      <SelectItem value="Retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.primary_work_role && (
                    <p className="text-sm text-red-500">{errors.primary_work_role}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="font-bold">Employment Industry <Star className="inline h-3 w-3 text-red-500 ml-1" /></Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={`w-full justify-between ${errors.employment_industry ? 'border-red-500' : ''}`}
                      >
                        {profileData.employment_industry || 'Select your employment industry'}
                        <svg
                          className="ml-2 h-4 w-4 shrink-0 opacity-50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search employment industry..." />
                        <CommandList>
                          <CommandEmpty>No employment industry found.</CommandEmpty>
                          <CommandGroup>
                            {[
                              'Not applicable', 'Education', 'Finance & Banking', 'Food & Beverage', 
                              'Government & Non-Profit', 'Healthcare', 'Hospitality & Travel', 
                              'Manufacturing & Construction', 'Media & Entertainment', 'Software & IT Services',
                              'Retail', 'Other'
                            ].map((industry) => (
                               <CommandItem
                                 key={industry}
                                 value={industry}
                                 onSelect={(currentValue) => {
                                   setProfileData({...profileData, employment_industry: currentValue});
                                 }}
                                 className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
                               >
                                 {industry}
                               </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {errors.employment_industry && (
                    <p className="text-sm text-red-500">{errors.employment_industry}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="font-bold">Job Function <Star className="inline h-3 w-3 text-red-500 ml-1" /></Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={`w-full justify-between ${errors.job_function ? 'border-red-500' : ''}`}
                      >
                        {profileData.job_function || 'Select your job function'}
                        <svg
                          className="ml-2 h-4 w-4 shrink-0 opacity-50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search job function..." />
                        <CommandList>
                          <CommandEmpty>No job function found.</CommandEmpty>
                          <CommandGroup>
                            {[
                              'Accounting', 'Administrative', 'Arts & Design', 'Business Development',
                              'Community & Social Services', 'Consulting', 'Customer Support', 'Education',
                              'Engineering', 'Entrepreneur', 'Finance', 'Healthcare', 'Human Resources',
                              'Information Technology', 'Legal', 'Marketing', 'Media & Communications',
                              'Military & Security Services', 'Operations', 'Product Management',
                              'Program & Project Management', 'Purchasing', 'Quality Assurance',
                              'Real Estate', 'Research', 'Sales', 'Not applicable', 'Other'
                            ].map((jobFunction) => (
                               <CommandItem
                                 key={jobFunction}
                                 value={jobFunction}
                                 onSelect={(currentValue) => {
                                   setProfileData({...profileData, job_function: currentValue});
                                 }}
                                 className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
                               >
                                 {jobFunction}
                               </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {errors.job_function && (
                    <p className="text-sm text-red-500">{errors.job_function}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="font-bold">Company Size <Star className="inline h-3 w-3 text-red-500 ml-1" /></Label>
                  <Select 
                    value={profileData.company_size} 
                    onValueChange={(value) => setProfileData({...profileData, company_size: value})}
                  >
                    <SelectTrigger className={errors.company_size ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select your company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Self employed">Self employed</SelectItem>
                      <SelectItem value="Startup">Startup</SelectItem>
                      <SelectItem value="Small or Medium business (1–999 employees)">Small or Medium business (1–999 employees)</SelectItem>
                      <SelectItem value="Large or Enterprise (1,000+ employees)">Large or Enterprise (1,000+ employees)</SelectItem>
                      <SelectItem value="Not applicable">Not applicable</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.company_size && (
                    <p className="text-sm text-red-500">{errors.company_size}</p>
                  )}
                </div>

                {successMessage && (
                  <p className="text-sm text-green-600 font-medium animate-fade-in">{successMessage}</p>
                )}

                 <Button 
                   onClick={() => handleSave('education')} 
                   disabled={isLoading}
                   className="w-full md:w-auto transition-all duration-200 hover:scale-105"
                 >
                   {isLoading ? 'Saving...' : 'Save'}
                 </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>AI & Tech Fluency</CardTitle>
                <CardDescription>Your technical skills and AI experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                   <Label className="font-bold">Technical Experience <Star className="inline h-3 w-3 text-red-500 ml-1" /></Label>
                  <Select 
                    value={profileData.technical_experience} 
                    onValueChange={(value) => setProfileData({...profileData, technical_experience: value})}
                  >
                    <SelectTrigger className={errors.technical_experience ? 'border-red-500' : ''}>
                      <SelectValue placeholder="How would you rate your general technical experience?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Below average">Below average</SelectItem>
                      <SelectItem value="Average">Average</SelectItem>
                      <SelectItem value="Expert (programmer, engineer, etc.)">Expert (programmer, engineer, etc.)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.technical_experience && (
                    <p className="text-sm text-red-500">{errors.technical_experience}</p>
                  )}
                </div>

                 <div className="space-y-2">
                   <Label className="font-bold">What AI Interests You Most? <Star className="inline h-3 w-3 text-red-500 ml-1" /></Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['AI in Finance', 'Productivity AI', 'Conversational AI/Chatbots', 'Generative AI (Image/Video)', 'Generative AI (Text)', 'AI for Education', 'AI Ethics', 'Machine Learning (General)', 'AI for Gaming', 'Natural Language Processing (NLP)', 'Computer Vision', 'AI in Healthcare', 'Other'].map(interest => (
                      <div key={interest} className="flex items-center space-x-2">
                        <Checkbox
                          id={interest}
                          checked={profileData.ai_interests.includes(interest)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setProfileData({
                                ...profileData,
                                ai_interests: [...profileData.ai_interests, interest]
                              });
                            } else {
                              setProfileData({
                                ...profileData,
                                ai_interests: profileData.ai_interests.filter(i => i !== interest)
                              });
                            }
                          }}
                        />
                        <Label htmlFor={interest} className="text-sm">{interest}</Label>
                      </div>
                    ))}
                  </div>
                  {errors.ai_interests && (
                    <p className="text-sm text-red-500">{errors.ai_interests}</p>
                  )}
                </div>

                 <div className="space-y-2">
                   <Label className="font-bold">How Familiar Are You with AI Concepts? <Star className="inline h-3 w-3 text-red-500 ml-1" /></Label>
                  <Select 
                    value={profileData.ai_familiarity} 
                    onValueChange={(value) => setProfileData({...profileData, ai_familiarity: value})}
                  >
                    <SelectTrigger className={errors.ai_familiarity ? 'border-red-500' : ''}>
                      <SelectValue placeholder="How would you describe your familiarity with core AI concepts?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basic (I use AI tools daily)">Basic (I use AI tools daily)</SelectItem>
                      <SelectItem value="Intermediate (I understand core ML/NN concepts)">Intermediate (I understand core ML/NN concepts)</SelectItem>
                      <SelectItem value="Advanced (I can explain ML algorithms/Deep Learning)">Advanced (I can explain ML algorithms/Deep Learning)</SelectItem>
                      <SelectItem value="Expert (I work with/research AI professionally)">Expert (I work with/research AI professionally)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.ai_familiarity && (
                    <p className="text-sm text-red-500">{errors.ai_familiarity}</p>
                  )}
                </div>

                 <div className="space-y-2">
                   <Label className="font-bold">Which Specific AI/GPT Models Do You Use? <Star className="inline h-3 w-3 text-red-500 ml-1" /></Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['ChatGPT (4.0)', 'Claude', 'Gemini', 'DALL·E', 'Midjourney', 'ChatGPT (3.5)', 'Perplexity AI', 'Stable Diffusion', 'Siri/Alexa (voice assistants)', 'Copilot', 'Other'].map(model => (
                      <div key={model} className="flex items-center space-x-2">
                        <Checkbox
                          id={model}
                          checked={profileData.ai_models_used.includes(model)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setProfileData({
                                ...profileData,
                                ai_models_used: [...profileData.ai_models_used, model]
                              });
                            } else {
                              setProfileData({
                                ...profileData,
                                ai_models_used: profileData.ai_models_used.filter(m => m !== model)
                              });
                            }
                          }}
                        />
                        <Label htmlFor={model} className="text-sm">{model}</Label>
                      </div>
                    ))}
                  </div>
                  {errors.ai_models_used && (
                    <p className="text-sm text-red-500">{errors.ai_models_used}</p>
                  )}
                </div>

                 <div className="space-y-2">
                   <Label className="font-bold">Programming Languages You're Familiar With? <Star className="inline h-3 w-3 text-red-500 ml-1" /></Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Python', 'JavaScript', 'Java', 'C++', 'R', 'Go', 'Rust', 'SQL', 'HTML/CSS', 'None'].map(lang => (
                      <div key={lang} className="flex items-center space-x-2">
                        <Checkbox
                          id={lang}
                          checked={profileData.programming_languages.includes(lang)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setProfileData({
                                ...profileData,
                                programming_languages: [...profileData.programming_languages, lang]
                              });
                            } else {
                              setProfileData({
                                ...profileData,
                                programming_languages: profileData.programming_languages.filter(l => l !== lang)
                              });
                            }
                          }}
                        />
                        <Label htmlFor={lang} className="text-sm">{lang}</Label>
                      </div>
                    ))}
                  </div>
                  {errors.programming_languages && (
                    <p className="text-sm text-red-500">{errors.programming_languages}</p>
                  )}
                </div>

                 <div className="space-y-2">
                   <Label className="font-bold">Your Specific Skills</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Bug Reporting', 'Creative Writing', 'Data Analysis', 'User Research', 'UI/UX Evaluation', 'Prompt Engineering', 'Product Management', 'Technical Writing', 'Community Building', 'Graphic Design', 'Other'].map(skill => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={skill}
                          checked={profileData.specific_skills.includes(skill)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setProfileData({
                                ...profileData,
                                specific_skills: [...profileData.specific_skills, skill]
                              });
                            } else {
                              setProfileData({
                                ...profileData,
                                specific_skills: profileData.specific_skills.filter(s => s !== skill)
                              });
                            }
                          }}
                        />
                        <Label htmlFor={skill} className="text-sm">{skill}</Label>
                      </div>
                    ))}
                  </div>
                  {errors.specific_skills && (
                    <p className="text-sm text-red-500">{errors.specific_skills}</p>
                  )}
                </div>

                 <div className="space-y-2">
                   <Label className="font-bold">Have You Discovered Any Cool AI Tools Recently?</Label>
                  <textarea
                    className={`w-full min-h-[120px] p-3 border border-input bg-background text-foreground rounded-md resize-none ${errors.ai_tools_discovery ? 'border-red-500' : ''}`}
                    placeholder="Have you recently discovered any cool AI tools or trends you're following? (Optional)"
                    value={profileData.ai_tools_discovery}
                    onChange={(e) => setProfileData({...profileData, ai_tools_discovery: e.target.value})}
                  />
                  {errors.ai_tools_discovery && (
                    <p className="text-sm text-red-500">{errors.ai_tools_discovery}</p>
                  )}
                </div>

                {successMessage && (
                  <p className="text-sm text-green-600 font-medium animate-fade-in">{successMessage}</p>
                )}

                 <Button 
                   onClick={() => handleSave('ai')} 
                   disabled={isLoading}
                   className="w-full md:w-auto transition-all duration-200 hover:scale-105"
                 >
                   {isLoading ? 'Saving...' : 'Save'}
                 </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio & Social Presence</CardTitle>
                <CardDescription>Your online presence and portfolio information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-bold">Have You Built or Contributed to Any Projects (AI or otherwise) Before? <Star className="inline h-3 w-3 text-red-500 ml-1" /></Label>
                  <RadioGroup 
                    value={profileData.has_projects?.toString() || ''} 
                    onValueChange={(value) => setProfileData({...profileData, has_projects: value === 'true', portfolio_url: value === 'false' ? '' : profileData.portfolio_url})}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="has_projects_yes" />
                      <Label htmlFor="has_projects_yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="has_projects_no" />
                      <Label htmlFor="has_projects_no">No</Label>
                    </div>
                  </RadioGroup>
                  {errors.has_projects && (
                    <p className="text-sm text-red-500">{errors.has_projects}</p>
                  )}
                </div>

                {profileData.has_projects && (
                  <div className="space-y-2">
                    <Label className="font-bold">Share Your Portfolio <Star className="inline h-3 w-3 text-red-500 ml-1" /></Label>
                    <Input
                      type="url"
                      placeholder="https://github.com/yourprofile"
                      value={profileData.portfolio_url}
                      onChange={(e) => setProfileData({...profileData, portfolio_url: e.target.value})}
                      className={errors.portfolio_url ? 'border-red-500' : ''}
                    />
                    {errors.portfolio_url && (
                      <p className="text-sm text-red-500">{errors.portfolio_url}</p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="font-bold">Which social networks do you use? <Star className="inline h-3 w-3 text-red-500 ml-1" /></Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Facebook', 'Twitter', 'Instagram', 'Snapchat', 'LinkedIn', 'Pinterest'].map(network => (
                      <div key={network} className="flex items-center space-x-2">
                        <Checkbox
                          id={network}
                          checked={profileData.social_networks.includes(network)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setProfileData({
                                ...profileData,
                                social_networks: [...profileData.social_networks, network]
                              });
                            } else {
                              setProfileData({
                                ...profileData,
                                social_networks: profileData.social_networks.filter(n => n !== network)
                              });
                            }
                          }}
                        />
                        <Label htmlFor={network} className="text-sm">{network}</Label>
                      </div>
                    ))}
                  </div>
                  {errors.social_networks && (
                    <p className="text-sm text-red-500">{errors.social_networks}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="font-bold">How would you like to help amplify AI products you love? <Star className="inline h-3 w-3 text-red-500 ml-1" /></Label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      'Post general positive updates on my social media (e.g., "Tried X AI, it\'s cool!")',
                      'Write short reviews/testimonials for specific AI products',
                      'Create original content (e.g., a brief video, a quick tutorial) about products I genuinely love',
                      'Participate in short Q&A sessions or interviews about my experience',
                      'Join specific client communities (e.g., their Discord, LinkedIn Group)',
                      'None of the above, I prefer to focus on feedback only.'
                    ].map(option => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={option}
                          checked={profileData.help_amplify_products.includes(option)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setProfileData({
                                ...profileData,
                                help_amplify_products: [...profileData.help_amplify_products, option]
                              });
                            } else {
                              setProfileData({
                                ...profileData,
                                help_amplify_products: profileData.help_amplify_products.filter(o => o !== option)
                              });
                            }
                          }}
                        />
                        <Label htmlFor={option} className="text-sm">{option}</Label>
                      </div>
                    ))}
                  </div>
                  {errors.help_amplify_products && (
                    <p className="text-sm text-red-500">{errors.help_amplify_products}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="font-bold">Willingness for Public Testimonials/UGC? <Star className="inline h-3 w-3 text-red-500 ml-1" /></Label>
                  <RadioGroup 
                    value={profileData.public_testimonials_ok?.toString() || ''} 
                    onValueChange={(value) => setProfileData({...profileData, public_testimonials_ok: value === 'true'})}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="testimonials_yes" />
                      <Label htmlFor="testimonials_yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="testimonials_no" />
                      <Label htmlFor="testimonials_no">No</Label>
                    </div>
                  </RadioGroup>
                  {errors.public_testimonials_ok && (
                    <p className="text-sm text-red-500">{errors.public_testimonials_ok}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="font-bold">Discord Username (Optional)</Label>
                  <Input
                    type="text"
                    placeholder="e.g., Explorer#1234"
                    value={profileData.discord_username}
                    onChange={(e) => setProfileData({...profileData, discord_username: e.target.value})}
                    className={errors.discord_username ? 'border-red-500' : ''}
                  />
                  {errors.discord_username && (
                    <p className="text-sm text-red-500">{errors.discord_username}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="font-bold">LinkedIn Profile Link (Optional)</Label>
                  <Input
                    type="url"
                    placeholder="https://linkedin.com/in/yourprofile"
                    value={profileData.linkedin_url}
                    onChange={(e) => setProfileData({...profileData, linkedin_url: e.target.value})}
                    className={errors.linkedin_url ? 'border-red-500' : ''}
                  />
                  {errors.linkedin_url && (
                    <p className="text-sm text-red-500">{errors.linkedin_url}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="font-bold">X (Twitter) Profile Link (Optional)</Label>
                  <Input
                    type="url"
                    placeholder="https://x.com/yourprofile"
                    value={profileData.twitter_url}
                    onChange={(e) => setProfileData({...profileData, twitter_url: e.target.value})}
                    className={errors.twitter_url ? 'border-red-500' : ''}
                  />
                  {errors.twitter_url && (
                    <p className="text-sm text-red-500">{errors.twitter_url}</p>
                  )}
                </div>

                {successMessage && (
                  <p className="text-sm text-green-600 font-medium animate-fade-in">{successMessage}</p>
                )}

                 <Button 
                   onClick={() => handleFinish()} 
                   disabled={isLoading}
                   className="w-full md:w-auto transition-all duration-200 hover:scale-105 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                 >
                   {isLoading ? 'Saving...' : 'Finish Profile Setup'}
                 </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default UserPortal;