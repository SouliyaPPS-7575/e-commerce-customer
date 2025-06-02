import { useMemo } from "react"
import { useCurrencyContext, formatCurrency } from "~/components/CurrencySelector/CurrencyProvider"

interface CartItem {
     id: string
     price: number
     quantity: number
}

export function useOrderCalculations(orderItems: CartItem[]) {
     const { displayCurrency, convert } = useCurrencyContext()

     const calculations = useMemo(() => {
          const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
          const shippingFee = 0
          const total = subtotal + shippingFee

          return {
               subtotal,
               shippingFee,
               total,
          }
     }, [orderItems])

     return {
          ...calculations,
          displayCurrency,
          convert,
          formatCurrency,
     }
}
