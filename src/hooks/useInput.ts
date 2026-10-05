import { useState, ChangeEvent } from "react";
export default function useInput(initial = ""): [string, (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void, (v: string) => void] {
  const [value, setValue] = useState(initial);
  return [value, (e) => setValue(e.target.value), setValue];
}
