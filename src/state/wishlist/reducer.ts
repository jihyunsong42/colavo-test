import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface wishListState {
  items: any[]
}

const initialState: wishListState = {
  items: [],
}

const wishListSlice = createSlice({
  name: 'wishList',
  initialState,
  reducers: {
    setWishList(state, action: PayloadAction<any[]>) {
      state.items = action.payload
    },
  },
})

export const { setWishList } = wishListSlice.actions
export default wishListSlice.reducer