import {Component, OnInit} from '@angular/core';
import {GetResponseProduct, ProductService} from '../../services/product.service';
import {Product} from "../../common/product";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {

  products: Product[];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  category: string;
  name: string;

  pageNumber: number = 1;
  pageSize: number = 3;
  collectionSize: number = 0;


  constructor(private productService: ProductService, public activateRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activateRoute.paramMap.subscribe(() => {
      this.handleProducts()
    });
  }

  handleProducts() {
    let hasCategoryId: boolean = this.activateRoute.snapshot.paramMap.has('id');
    let hasProductName: boolean = this.activateRoute.snapshot.paramMap.has('name');

    if (hasProductName) {
      this.name = this.activateRoute.snapshot.paramMap.get('name');
      this.getSearchedProducts(this.name);
    } else if (hasCategoryId) {
      this.currentCategoryId = +this.activateRoute.snapshot.paramMap.get('id');

      //check if user get new category. If yes, paginate from 1
      if (this.previousCategoryId != this.currentCategoryId) {
        this.pageNumber = 1
      }
      this.previousCategoryId = this.currentCategoryId;

      this.getProducts(this.currentCategoryId, this.pageNumber, this.pageSize);
    } else {
      this.getProducts(1, this.pageNumber, this.pageSize);
    }
  }

  getSearchedProducts(name: string) {
    this.productService.getSearchedProductsList(name).subscribe(data => this.products = data)
  }

  getProducts(categoryId: number, pageNumber: number, pageSize: number) {
    this.productService.getProductsPageable(categoryId, pageNumber - 1, pageSize)
      .subscribe( data => this.resultProcess(data));
  }

  resultProcess(data:GetResponseProduct){
    this.products = data._embedded.products;
    this.pageNumber = data.page.number + 1;
    this.pageSize = data.page.size;
    this.collectionSize = data.page.totalElements;
  }
}
