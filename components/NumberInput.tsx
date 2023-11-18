import { Button } from "@/components/ui/button"

interface NumberInputProps {
    value: number
    onChange: (newValue: number) => void
    max?: number
}

export default function NumberInput({ value, max, onChange }: NumberInputProps) {
    return <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => onChange(Math.max(1, value - 1))}>-</Button>
        <p className="text-sm">{value}</p>
        <Button variant="outline" size="sm" onClick={() => onChange(max ? Math.min(max, value + 1) : value + 1)}>+</Button>
    </div>
}