import { createContext, useContext } from 'react'

// Holds the "open this item in the lightbox" function.
export const ModalContext = createContext(() => {})
export const useModal = () => useContext(ModalContext)
