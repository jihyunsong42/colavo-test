import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface WishListItem { 
  id: string,
  name: string,
  type: 'style' | 'discount',
  count?: number,
  price?: number,
  priceToDisplay?: string,
  discountedPrice?: number,
  rate?: number,
  target?: string,
  currencyCode: string
}

interface wishListState {
  items: WishListItem[]
}

const initialState: wishListState = {
  items: []
}

const wishListSlice = createSlice({
  name: 'wishList',
  initialState,
  reducers: {
    setWishList(state, action: PayloadAction<WishListItem[]>) {
      state.items = action.payload
    },
  },
})

export const { setWishList } = wishListSlice.actions
export default wishListSlice.reducer