import { useMemo } from "react"
import { useCurrencyContext, formatCurrency } from "~/components/CurrencySelector/CurrencyProvider"
import { OrderItemRes } from "~/models/orders"



export function useOrderCalculations(orderItems: OrderItemRes[]) {
     const { displayCurrency, convert } = useCurrencyContext()

     const calculations = useMemo(() => {
          const subtotal = orderItems.reduce((sum, item) => sum + item?.price_lak * item?.quantity, 0)
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
