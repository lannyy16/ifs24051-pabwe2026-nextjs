'use client'
import { useState } from 'react'
export function useInput<T>(initial:T) { const [value,setValue]=useState(initial); const onChange=(e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>)=>setValue(e.target.value as T); return {value,setValue,onChange,bind:{value,onChange}} }
