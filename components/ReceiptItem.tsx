import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReceiptItem } from "../types";

export default function ReceiptItem({ item }: { item: ReceiptItem }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {item.name} x{item.quantity}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xl">Total: {item.price}€</p>
      </CardContent>
      <CardFooter className="space-x-4">
        <Button size="sm">Take amount</Button>
        <Button size="sm">Divide</Button>
      </CardFooter>
    </Card>
  );
}
