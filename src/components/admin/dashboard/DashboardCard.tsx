
import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  description: string;
  value: string | number;
  icon: LucideIcon;
  linkText?: string;
  onLinkClick?: () => void;
  iconColor?: string;
}

const DashboardCard = ({
  title,
  description,
  value,
  icon: Icon,
  linkText,
  onLinkClick,
  iconColor = "text-pink-600"
}: DashboardCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <Icon className={`h-5 w-5 mr-2 ${iconColor}`} />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {linkText && (
          <Button 
            variant="link" 
            className="p-0 h-auto text-pink-700"
            onClick={onLinkClick}
          >
            {linkText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
