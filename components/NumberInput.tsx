import { Button } from "@/components/ui/button"

interface NumberInputProps {
    value: number
    onChange: (newValue: number) => void
}

export default function NumberInput({ value, onChange }: NumberInputProps) {
    return <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => onChange(value - 1)}>-</Button>
        <p className="text-sm">{value}</p>
        <Button variant="outline" size="sm" onClick={() => onChange(value - 1)}>+</Button>
    </div>
}