import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";
import {Product} from "../common/product";
import {map} from "rxjs/operators";
import {ProductCategory} from "../common/product-category";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseProductUrl: string = "http://localhost:8080/api/products";
  private baseCategoryUrl: string = "http://localhost:8080/api/categories";

  constructor(private http: HttpClient) {
  }

  getProductsList(currentCategoryId:number): Observable<Product[]> {
   const url: string = `${this.baseProductUrl}/search/findByCategoryId?id=${currentCategoryId}`;
    return this.http.get<GetResponseProduct>(url)
      .pipe(map(response => response._embedded.products))
  }

  getProductCategoryList(): Observable<ProductCategory[]> {
    return this.http.get<GetResponseProductCategories>(this.baseCategoryUrl)
      .pipe(map(response => response._embedded.productCategories))
  }

  getSearchedProductsList(name: string):Observable<Product[]> {
    const url: string = `${this.baseProductUrl}/search/findProductByNameContains?name=${name}`;
    return this.http.get<GetResponseProduct>(url)
      .pipe(map(response => response._embedded.products))
  }

  getProduct(productId:number):Observable<Product> {

        return this.http.get<Product>(`${this.baseProductUrl}/${productId}`);
  }
}

export interface GetResponseProduct {
  _embedded: {
    products: Product [];
  }
}

export interface GetResponseProductCategories {
  _embedded: {
    productCategories: ProductCategory [];
  }
}
