/**
 * Factor Settings - How settings work in Factor...
 *
 * Your settings files are how you customize themes and plugins.
 * They allow you to set text and images, but also override components, routes and more.
 *
 */
/*export default {
  dashboard: {
    route: "/dashboard",
  },
}*/
export default {

  app: {
    components: {
      error404: (): Promise<any> => import("./404.vue"),
    },
  },

  site: {
    logo: require("./static/img/tross.svg"),
    logoInverse: require("./static/img/tross.svg"),
    nav: [
      {
        _item: "home",
        path: "/",
        name: "Home",
      },
      {
        _item: "aktive_vertreter",
        path: "/fs-vertreter",
        name: "Aktive Vertreter",
      },
      {
        _item: "Keine Panik",
        path: "/keine-panik",
        name: "Keine Panik",
      },
      {
        _item: "Sprechstunden",
        path: "/sprechstunden",
        name: "Sprechstunden",
      },
      {
        _item: "Aktuelles",
        path: "/aktuelles",
        name: "Aktuelles",
      },
      {
        _item: "Kontakt",
        path: "/kontakt",
        name: "Kontakt",
      },
      {
        _item: "dashboard",
        path: "/dashboard",
        name: "Dashboard &rarr;",
      },
    ],
  },
  /**
 * Copy for the home page template.
 */
  home: {
    component: (): Promise<any> => import("./home.vue"),
    buttons: [
      {
        _item: "Kontakt",
        link: "/kontakt",
        text: "Nimm Kontakt mit uns auf ;)",
        classes: "btn mr-4 text-purple-100 bg-purple-500 hover:bg-purple-600",
      },
    ]
  },

  aktive_vertreter: {

    buttons: [
      {
        _item: "Kontakt",
        link: "/kontakt",
        text: "Nimm Kontakt mit uns auf ;)",
        classes: "btn mr-4 text-purple-100 bg-purple-500 hover:bg-purple-600",
      },
    ]
  },
  /*blog: {
    pretitle: "Because the future comes fast",
    title: "Zeno Blog",
    content:
      "Discover the latest product updates, announcements, and articles from the Zeno team",
    indexRoute: "/blog",
    postRoute: "/entry",
    limit: 6,
    returnLinkText: "Back",
    notFound: {
      title: "No Posts",
      subTitle: "Couldn't find any blog posts.",
    },
    promo: {
      pretitle: "Built with Factor CMS",
      title: "About Theme Zeno",
      content:
        "Zeno is a minimalist theme suited for the needs of IT companies and tech startups. Zeno styles are powered by Tailwind, a low-level CSS framework.",
      button: {
        link: "/about",
        text: "Learn More",
        classes: "btn bg-gray-100 rounded text-purple-500 hover:text-purple-600",
      },
    },
    components: {
      blogIndex: (): Promise<any> => import("./blog/blog-index.vue"),
      blogSingle: (): Promise<any> => import("./blog/blog-single.vue"),
      featuredImage: (): Promise<any> => import("./blog/el-featured-image.vue"),
      title: (): Promise<any> => import("./blog/widget-title.vue"),
      date: (): Promise<any> => import("./blog/widget-date.vue"),
      author: (): Promise<any> => import("./blog/widget-author.vue"),
      singleHeader: (): Promise<any> => import("./blog/el-single-header.vue"),
      entry: (): Promise<any> => import("./blog/widget-entry.vue"),
      social: (): Promise<any> => import("./blog/widget-social.vue"),
      pagination: (): Promise<any> => import("./blog/widget-pagination.vue"),
    },
    layout: {
      index: ["featuredImage", "date", "title", "author"],
      single: ["singleHeader", "entry", "social"],
    },
    metatags: {
      index: {
        title: "Blog - The Latest from Zeno Theme",
        description:
          "Discover the latest product updates, announcements, and articles from the Zeno team",
        image: require("./img/logo-zeno.jpg"),
      },
    },
  },*/
  // Footer
  footer: {
    nav: [
      {
        _item: "home",
        path: "/",
        name: "Home",
      },
      {
        _item: "Aktive Vertreter",
        path: "/fs-vertreter",
        name: "Aktive Vertreter",
      },
      {
        _item: "Keine Panik",
        path: "/keine-panik",
        name: "Keine Panik",
      },
      {
        _item: "Sprechstunden",
        path: "/sprechstunden",
        name: "Sprechstunden",
      },
      {
        _item: "Aktuelles",
        path: "/aktuelles",
        name: "Aktuelles",
      },
      {
        _item: "Kontakt",
        path: "/kontakt",
        name: "Kontakt",
      },
      {
        _item: "twitter",
        path: "https://twitter.com/",
        icon: "fab fa-twitter",
        target: "_blank",
      },
      {
        _item: "instagram",
        path: "https://www.instagram.com/fachschaft_mpi/?hl=de",
        icon: "fab fa-instagram",
        target: "_blank",
      },
      {
        _item: "facebook",
        path: "https://de-de.facebook.com/fsmpi/",
        icon: "fab fa-facebook",
        target: "_blank",
      },
    ],
    figure: null,
  },
}
