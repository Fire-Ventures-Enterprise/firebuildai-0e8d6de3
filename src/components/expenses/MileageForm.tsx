import { useState, useEffect } from "react";
import { Car } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import type { MileageLog } from "@/domain/expenses";

interface MileageFormProps {
  mileageLog?: Partial<MileageLog>;
  onChange: (log: Partial<MileageLog>) => void;
  disabled?: boolean;
}

export function MileageForm({ mileageLog = {}, onChange, disabled }: MileageFormProps) {
  const [startOdometer, setStartOdometer] = useState(mileageLog.start_odometer || 0);
  const [endOdometer, setEndOdometer] = useState(mileageLog.end_odometer || 0);
  const [distance, setDistance] = useState(mileageLog.distance_km || 0);
  const [rate] = useState(mileageLog.rate_per_km || 0.68);
  const [vehicleName, setVehicleName] = useState(mileageLog.vehicle_name || '');

  useEffect(() => {
    // Calculate distance when odometer values change
    if (endOdometer > startOdometer) {
      const calculatedDistance = endOdometer - startOdometer;
      setDistance(calculatedDistance);
      onChange({
        ...mileageLog,
        start_odometer: startOdometer,
        end_odometer: endOdometer,
        distance_km: calculatedDistance,
        rate_per_km: rate,
        vehicle_name: vehicleName || null,
      });
    }
  }, [startOdometer, endOdometer, rate, vehicleName]);

  const handleDistanceChange = (value: number) => {
    setDistance(value);
    onChange({
      ...mileageLog,
      distance_km: value,
      rate_per_km: rate,
      vehicle_name: vehicleName || null,
    });
  };

  const totalAmount = distance * rate;

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <Car className="h-5 w-5" />
        <h3 className="font-medium">Mileage Details</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="vehicle">Vehicle Name</Label>
          <Input
            id="vehicle"
            value={vehicleName}
            onChange={(e) => setVehicleName(e.target.value)}
            placeholder="e.g., Company Truck #1"
            disabled={disabled}
          />
        </div>

        <div>
          <Label htmlFor="rate">Rate per KM</Label>
          <Input
            id="rate"
            type="number"
            value={rate}
            disabled
            className="bg-muted"
          />
        </div>

        <div>
          <Label htmlFor="start-odometer">Start Odometer</Label>
          <Input
            id="start-odometer"
            type="number"
            value={startOdometer || ''}
            onChange={(e) => setStartOdometer(parseFloat(e.target.value) || 0)}
            placeholder="e.g., 45000"
            disabled={disabled}
          />
        </div>

        <div>
          <Label htmlFor="end-odometer">End Odometer</Label>
          <Input
            id="end-odometer"
            type="number"
            value={endOdometer || ''}
            onChange={(e) => setEndOdometer(parseFloat(e.target.value) || 0)}
            placeholder="e.g., 45150"
            disabled={disabled}
          />
        </div>

        <div>
          <Label htmlFor="distance">Distance (KM)</Label>
          <Input
            id="distance"
            type="number"
            value={distance || ''}
            onChange={(e) => handleDistanceChange(parseFloat(e.target.value) || 0)}
            placeholder="Auto-calculated or enter manually"
            disabled={disabled}
          />
        </div>

        <div>
          <Label>Total Amount</Label>
          <div className="text-2xl font-bold text-primary">
            ${totalAmount.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {distance} km × ${rate}/km
          </p>
        </div>
      </div>
    </Card>
  );
}