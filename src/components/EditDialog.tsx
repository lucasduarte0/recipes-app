import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { DialogHeader } from './ui/dialog';

interface EditDialogProps {
  title: string;
  fieldName: string;
  defaultValue: string;
  type?: string;
  onSubmit: (value: string) => void;
}

export function EditDialog({
  title,
  fieldName,
  defaultValue,
  type = 'text',
  onSubmit,
}: EditDialogProps) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    onSubmit(value);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full">
          <div className="flex items-center justify-between py-4 px-1">
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium text-gray-500">{title}</span>
              <span className="text-base">
                {defaultValue || `Add ${title.toLowerCase()}`}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label
              htmlFor={fieldName}
              className="text-sm font-medium text-gray-500">
              {fieldName}
            </label>
            <Input
              id={fieldName}
              name={fieldName}
              type={type}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
