import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
  } from "@/components/ui/input-otp"
import { Button } from "./ui/button";
  
  export function InputCodeOTP({ onSubmit }: { onSubmit: (code: string) => void }) {
    const handleSubmit = () => {
      const code = Array.from(document.querySelectorAll("input")).map(
        (input: HTMLInputElement) => input.value
      ).join("");
      onSubmit(code);  // Envia o código para validação
    }
  
    return (
      <div>
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <Button onClick={handleSubmit}>Validar Código</Button>
      </div>
    )
  }
  