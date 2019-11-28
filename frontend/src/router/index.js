import Vue from "vue";
import Router from "vue-router";
import MovieListPage from "@/components/MovieListPage";
import DetailMoviePage from "@/components/DetailMoviePage";
import testPage from "@/components/testPage";
import SearchPage from "@/components/SearchPage";
import tabletest from "@/components/tabletest";
Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/movies",
      name: "movielist",
      component: MovieListPage
    },
    {
      path: "/movies/:id",
      name: "detailmovie",
      component: DetailMoviePage
    },
    {
      path: "/test",
      name: "test",
      component: testPage
    },
    {
      path: "/search",
      name: "search",
      component: SearchPage
    },
    {
      path: "/table",
      name: "table",
      component: tabletest
    }
  ]
});
