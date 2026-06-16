import type { FC } from 'react'

interface Props {
  children?: React.ReactNode;

}
export const Providers:FC<Props> = ({children}) => {
  return (
    <>

      {children}
    </>
  )
}
