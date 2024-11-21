import {inject, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {CategoryModel, CreateCategoryModel} from "../models/category.model";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly http = inject(HttpClient);

  getAllCategories(): Observable<CategoryModel[]> {
    return this.http.get<CategoryModel[]>('/categories');
  }

  createCategory(category: CreateCategoryModel): Observable<CategoryModel> {
    return this.http.post<CategoryModel>('/categories', category);
  }

  updateCategory(category: CategoryModel): Observable<CategoryModel> {
    return this.http.put<CategoryModel>(`/categories/${category.id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`/categories/${id}`);
  }
}
