// export type ProductCategory = 'multiply' | 'borrow' | 'earn'
export type ProductCategory = 'borrow'
export function getProductCategoryUrl(productCategory: ProductCategory): string {
  switch (productCategory) {
    // case 'multiply':
    //   return '/multiply'
    case 'borrow':
      return '/borrow'
    // case 'earn':
    //   return '/earn'
  }
}
