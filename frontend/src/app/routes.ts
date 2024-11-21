import {Routes} from "@angular/router";
import {ManageListsComponent} from "./components/manage-lists/manage-lists.component";
import {ListComponent} from "./components/list/list.component";
import {CategoriesComponent} from "./components/categories/categories.component";

const routes: Routes = [
  {path: '', component: ManageListsComponent},
  {path: 'lists/:listId', component: ListComponent},
  {path: 'categories', component: CategoriesComponent}
];

export default routes;
