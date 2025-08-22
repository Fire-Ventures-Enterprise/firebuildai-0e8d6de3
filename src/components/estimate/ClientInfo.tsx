import { Input } from "@/components/ui/input";

interface ClientInfoProps {
  clientName: string;
  clientEmail: string;
  phone: string;
  address: string;
  city: string;
  onUpdate: (field: string, value: string) => void;
}

export const ClientInfo = ({ 
  clientName, 
  clientEmail, 
  phone, 
  address, 
  city, 
  onUpdate 
}: ClientInfoProps) => {
  return (
    <div className="bg-green-50 border border-green-300 rounded p-4 mb-6">
      <div className="space-y-2">
        <Input
          placeholder="Client Name"
          value={clientName}
          onChange={(e) => onUpdate('clientName', e.target.value)}
          className="font-medium border-0 p-0 bg-transparent text-base"
          required
        />
        <Input
          placeholder="Client Email"
          type="email"
          value={clientEmail}
          onChange={(e) => onUpdate('clientEmail', e.target.value)}
          className="border-0 p-0 bg-transparent text-sm text-blue-600"
        />
        <Input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => onUpdate('phone', e.target.value)}
          className="border-0 p-0 bg-transparent text-sm"
        />
        <Input
          placeholder="Address"
          value={address}
          onChange={(e) => onUpdate('address', e.target.value)}
          className="border-0 p-0 bg-transparent text-sm"
          required
        />
        <Input
          placeholder="City, Province"
          value={city}
          onChange={(e) => onUpdate('city', e.target.value)}
          className="border-0 p-0 bg-transparent text-sm"
          required
        />
      </div>
    </div>
  );
};