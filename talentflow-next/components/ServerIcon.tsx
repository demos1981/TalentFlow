import React from 'react';
import { 
  Home, 
  Briefcase, 
  Users, 
  Building, 
  Info, 
  Mail, 
  Zap, 
  Brain, 
  BarChart3, 
  Linkedin, 
  Twitter, 
  Github 
} from 'lucide-react';

interface ServerIconProps {
  name: string;
  className?: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  home: Home,
  briefcase: Briefcase,
  users: Users,
  building: Building,
  info: Info,
  mail: Mail,
  zap: Zap,
  brain: Brain,
  chart: BarChart3,
  linkedin: Linkedin,
  twitter: Twitter,
  github: Github,
};

export const ServerIcon: React.FC<ServerIconProps> = ({ name, className }) => {
  const IconComponent = iconMap[name];
  if (!IconComponent) {
    return null;
  }
  return <IconComponent className={className} />;
};