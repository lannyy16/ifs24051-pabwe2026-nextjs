'use client'

import { DELCOM_BASEURL } from '@/lib/config'

export const getAccessToken = () => typeof window === 'undefined' ? null : localStorage.getItem('delcom_token')
export const putAccessToken = (token: string | null) => { if (typeof window !== 'undefined') token ? localStorage.setItem('delcom_token', token) : localStorage.removeItem('delcom_token'); return token }

export async function apiFetch<T = any>(path: string, options: { method?: string; body?: BodyInit | object; query?: Record<string,string|number|undefined|null>; auth?: boolean; headers?: HeadersInit } = {}): Promise<T> {
  const { method='GET', body, query, auth=true, headers={} } = options
  const url = new URL(`${DELCOM_BASEURL}${path}`)
  Object.entries(query || {}).forEach(([k,v]) => v !== undefined && v !== null && v !== '' && url.searchParams.set(k, String(v)))
  const h = new Headers({ Accept: 'application/json', ...headers })
  if (auth) { const token = getAccessToken(); if (token) h.set('Authorization', `Bearer ${token}`) }
  let payload: BodyInit | undefined
  if (body instanceof FormData || typeof body === 'string' || body instanceof URLSearchParams || body instanceof Blob) payload = body
  else if (body !== undefined) { h.set('Content-Type', 'application/json'); payload = JSON.stringify(body) }
  const response = await fetch(url, { method, headers: h, body: payload })
  const data = await response.json().catch(() => ({ success: response.ok, message: response.statusText }))
  if (!response.ok || data.success === false || data.status === 'fail') throw new Error(data.message || 'Request gagal')
  return data
}
export const get = <T=any>(p:string,o?:any) => apiFetch<T>(p,{...o,method:'GET'})
export const post = <T=any>(p:string,b?:any,o?:any) => apiFetch<T>(p,{...o,method:'POST',body:b})
export const put = <T=any>(p:string,b?:any,o?:any) => apiFetch<T>(p,{...o,method:'PUT',body:b})
export const del = <T=any>(p:string,o?:any) => apiFetch<T>(p,{...o,method:'DELETE'})
