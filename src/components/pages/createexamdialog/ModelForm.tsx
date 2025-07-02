import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExamDetails {
  examtitle: string;
  examinfo: string;
  startingtime: string;
  endingtime: string;
}

interface ModelFormProps {
  details: ExamDetails;
  setDetails: (details: ExamDetails) => void;
}

const ModelForm: React.FC<ModelFormProps> = ({ details, setDetails }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const handleDateChange = (date: Date | undefined, field: 'startingtime' | 'endingtime') => {
    if (date) {
      setDetails({ ...details, [field]: date.toISOString() });
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6 w-[450px]">
      <div className="space-y-4">
        <div>
          <Label htmlFor="examtitle">Exam Title</Label>
          <Input
            id="examtitle"
            name="examtitle"
            placeholder="Enter exam title"
            value={details.examtitle}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="examinfo">Exam Info</Label>
          <Textarea
            id="examinfo"
            name="examinfo"
            placeholder="Enter exam information"
            value={details.examinfo}
            onChange={handleInputChange}
            className="h-[120px] resize-none"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Starting Time</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !details.startingtime && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {details.startingtime ? (
                  format(new Date(details.startingtime), "PPP HH:mm")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={details.startingtime ? new Date(details.startingtime) : undefined}
                onSelect={(date) => handleDateChange(date, 'startingtime')}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label>Ending Time</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !details.endingtime && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {details.endingtime ? (
                  format(new Date(details.endingtime), "PPP HH:mm")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={details.endingtime ? new Date(details.endingtime) : undefined}
                onSelect={(date) => handleDateChange(date, 'endingtime')}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default ModelForm; 