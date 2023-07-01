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
    <div className="flex flex-col space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {item.name} x{item.quantity}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{item.unit_price}</p>
          <p>{item.price}</p>
        </CardContent>
        <CardFooter>
          <Button>Tomar</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
