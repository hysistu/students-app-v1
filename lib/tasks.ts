export type Task = {
  title: string;
  owner: string;
  summary: string;
  endpoints: string[];
  requirements: string[];
};
export type Group = {
  id: string;
  name: string;
  theme: string;
  members: number;
  brief: string;
  tasks: Task[];
  stretch: string[];
};

export const rules = [
  "Vetëm frontend. API-ja në Express ka gjithçka që ju duhet, prandaj mos e prekni students-api.",
  "Stack: Next.js, TypeScript, Tailwind. Përdorni përsëri lib/api.ts, components/ui.tsx dhe klasat .btn / .card / .field.",
  "Çdo response i API-së duhet të ketë type në lib/types.ts. Pa `any`.",
  "Çdo faqe me të dhëna duhet të ketë loading, empty dhe error state.",
  "Faqet duhet të duken mirë si në mobile (375px) ashtu edhe në desktop.",
  "Një branch për çdo grup. Çdo anëtar hap Pull Request-in e vet.",
  "Para se të dorëzoni, `npm run typecheck` dhe `npm run build` duhet të kalojnë pa gabime.",
];

export const groups: Group[] = [
  {
    id: "group-a",
    name: "Grupi A",
    theme: "Katalogu publik",
    members: 3,
    brief:
      "Ndërtoni katalogun publik që e shohin vizitorët pa u loguar. Proxy-ja mbron vetëm faqet e portalit, ndaj çdo faqe e re nën /catalog është publike by default.",
    tasks: [
      {
        title: "Catalog list me filtra",
        owner: "Anëtari 1",
        summary:
          "Faqja /catalog me grid kursesh, search, filtër çmimi, sorting dhe pagination.",
        endpoints: [
          "GET /api/public/courses?search=&minPrice=&maxPrice=&sort=&page=&limit=",
        ],
        requirements: [
          "sort pranon newest, price_asc, price_desc dhe rating. Një vlerë e gabuar kthen 400, prandaj shfaqeni gabimin te përdoruesi.",
          "Mbani çdo filtër në query string të URL-së, që faqja e filtruar të mund të ndahet me të tjerët dhe të mos humbasë pas refresh.",
          "Debounce te search input (rreth 300 ms).",
          "Pagination controls të ndërtuara nga objekti pagination i response-it.",
        ],
      },
      {
        title: "Course detail dhe rating breakdown",
        owner: "Anëtari 2",
        summary:
          "Faqja /catalog/[id] me kursin, instruktorin, rating-un mesatar dhe grafikun e shpërndarjes së yjeve nga 1 deri në 5.",
        endpoints: [
          "GET /api/public/courses/:id",
          "GET /api/courses/:id/reviews?page=&limit=",
        ],
        requirements: [
          "Vizatoni pesë bar-et e rating-ut nga objekti ratings, vetëm me CSS width. Pa librari për chart.",
          "Shfaqni review-t me emrin e studentit, yjet, komentin dhe datën. Shtoni butonin Load more.",
          "Kursi që nuk ekziston ose është inactive kthen 404. Shfaqni një not-found state të rregullt.",
          "Buton Log in to enroll për vizitorët. Studentët e loguar vazhdojnë me cart flow që ekziston tashmë.",
        ],
      },
      {
        title: "Shared UI dhe navigation",
        owner: "Anëtari 3",
        summary:
          "Komponentët që u duhen dy të tjerëve, plus header-i publik dhe landing page.",
        endpoints: ["GET /api/public/courses?sort=rating&limit=3"],
        requirements: [
          "Komponentët StarRating (read-only, mbështet edhe gjysmë yje si 4.5) dhe CourseCard. Bëjini të parët dhe bëjini push, që Anëtarët 1 dhe 2 t'i përdorin.",
          "Layout publik për /catalog me header: logo, link Catalog dhe buton Log in.",
          "Zëvendësoni redirect-in te app/page.tsx me një landing page që shfaq tre kurset me rating më të lartë. Përdoruesit e loguar vazhdojnë të shkojnë te dashboard.",
          "Skeleton loaders për grid-in e kartave.",
        ],
      },
    ],
    stretch: [
      "Rresht me chips për filtrat aktivë dhe buton Clear all.",
      "Buton Share që kopjon URL-në aktuale.",
    ],
  },
  {
    id: "group-b",
    name: "Grupi B",
    theme: "Student account",
    members: 3,
    brief:
      "Ndërtoni veçori për studentët e loguar: wishlist, review për kurset që kanë ndjekur dhe settings të profilit. Të gjitha këto endpoint-e kërkojnë session si student.",
    tasks: [
      {
        title: "Wishlist",
        owner: "Anëtari 1",
        summary:
          "Buton me zemër te kartat e kurseve dhe faqja /wishlist ku studentët menaxhojnë kurset e ruajtura.",
        endpoints: [
          "GET /api/wishlist",
          "POST /api/wishlist/items  { courseId }",
          "DELETE /api/wishlist/items/:courseId",
        ],
        requirements: [
          "Zemra është e mbushur kur kursi është ruajtur tashmë. Përditësoni UI menjëherë (optimistic update) dhe bëni rollback nëse request-i dështon.",
          "Nëse ruani kurs ku jeni enrolled tashmë, API kthen 409. Shfaqeni mesazhin.",
          "Faqja /wishlist shfaq kurset e ruajtura me butonat Remove dhe Add to cart (përdorni cart context që ekziston).",
          "Shtoni faqen te sidebar vetëm për rolin student.",
        ],
      },
      {
        title: "Reviews te My courses",
        owner: "Anëtari 2",
        summary:
          "Lejoni studentët të japin rating për kurset ku janë enrolled, pastaj ta ndryshojnë ose ta fshijnë review-n.",
        endpoints: [
          "POST /api/courses/:id/reviews  { rating, comment }",
          "PATCH /api/reviews/:id  { rating?, comment? }",
          "DELETE /api/reviews/:id",
        ],
        requirements: [
          "Star input që klikohet dhe punon edhe me keyboard, plus textarea për koment (maksimumi 1000 karaktere, me counter).",
          "Një student ka vetëm një review për kurs. Përpjekja e dytë kthen 409, ndaj kaloni formën në edit mode.",
          "Delete kërkon konfirmim në modal para se të thirret API-ja.",
          "Rating duhet të jetë numër i plotë nga 1 deri në 5. Bëni validation në client dhe shfaqni edhe error-in që vjen nga serveri.",
        ],
      },
      {
        title: "Profile dhe password",
        owner: "Anëtari 3",
        summary:
          "Faqja /profile ku çdo përdorues i loguar ndryshon të dhënat e veta dhe password-in.",
        endpoints: [
          "PATCH /api/auth/me  { name?, email? }",
          "POST /api/auth/change-password  { currentPassword, newPassword }",
        ],
        requirements: [
          "Dy forma të ndara, secila me submit button dhe success message të vetin.",
          "Pas save, përditësoni user-in te components/auth.tsx që sidebar të shfaqë emrin e ri pa reload.",
          "Forma e password-it: confirm field, minimumi 8 karaktere, toggle show/hide. Current password i gabuar kthen 400.",
          "Email i përdorur tashmë kthen 409. Shfaqeni pranë email field.",
          "Shtoni Profile te sidebar për të gjitha rolet.",
        ],
      },
    ],
    stretch: [
      "Password strength meter.",
      "Paralajmërim kur largoheni nga forma e profilit me ndryshime të pa-ruajtura.",
    ],
  },
  {
    id: "solo",
    name: "Studenti i vetëm",
    theme: "Instructor dashboard",
    members: 1,
    brief:
      "Një faqe, e bërë mirë. Instruktorët tani përdorin dashboard-in e adminit, që nuk u shkon. Ndërtoni një dashboard të vetin për ta, nga një endpoint i vetëm.",
    tasks: [
      {
        title: "Instructor dashboard",
        owner: "Ti",
        summary:
          "Faqja /instructor, e dukshme vetëm për rolin instructor, që përmbledh punën e tyre si mësimdhënës.",
        endpoints: ["GET /api/instructor/dashboard"],
        requirements: [
          "Katër stat cards nga totals: courses, active courses, students dhe revenue (përdorni helper-in money).",
          "Tabelë nga array-i courses: title, status badge, price, students, revenue dhe rating mesatar me yje. Sorting kur klikohet header-i i kolonës, në client.",
          "Listë Recent enrollments nga recentEnrollments (student, kurs, datë).",
          "Adminët dhe studentët që e hapin faqen bëhen redirect. Mos harroni që API-ja kthen 403 për ta, ndaj trajtojeni edhe këtë rast.",
          "Linku Dashboard te sidebar shkon te /instructor kur përdoruesi është instructor.",
          "Bëni vetë StarRating dhe stat card. Mos prisni komponentët e grupit tjetër.",
        ],
      },
    ],
    stretch: [
      "Bar chart vetëm me CSS për numrin e studentëve për kurs.",
      "Filtër për tabelën: active ose inactive.",
      "CSV export i tabelës, i krijuar në browser.",
    ],
  },
];
