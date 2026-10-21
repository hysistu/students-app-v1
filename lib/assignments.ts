export type Assignment = {
  title: string;
  owner: string;
  summary: string;
  where: string[];
  requirements: string[];
};

export type AssignmentGroup = {
  id: string;
  name: string;
  theme: string;
  members: number;
  brief: string;
  tasks: Assignment[];
  stretch: string[];
};

export const rules = [
  "Frontend only. Do not change students-api. The endpoints you need already exist.",
  "Stay on the existing stack: Next.js, TypeScript, and Tailwind. Reuse lib/api.ts, components/ui.tsx, and the .btn / .card / .field classes.",
  "Add any new response shape to lib/types.ts. No any.",
  "Every screen that loads data needs a loading state, an empty state, and an error state.",
  "The page has to work at 375px and on desktop.",
  "One branch per group. Each member opens their own pull request.",
  "npm run typecheck and npm run build must pass before you hand the work in.",
];

export const groups: AssignmentGroup[] = [
  {
    id: "group-a",
    name: "Group A",
    theme: "Seller dashboard",
    members: 3,
    brief:
      "Sellers currently land on the admin dashboard, which is not theirs. Build a dashboard that only a seller can open, using the products they already own.",
    tasks: [
      {
        title: "Seller home",
        owner: "Member 1",
        summary:
          "Create /seller. It is the seller’s home page and it summarizes that seller’s own products.",
        where: ["GET /api/products"],
        requirements: [
          "A seller already receives only their own products from GET /api/products. Do not add a new API.",
          "Four stat cards: total products, active products, products with stock under 5, and stock value (price × stock, summed).",
          "Format money as a currency. Do not show raw floats.",
          "Loading, empty (a seller with zero products), and error states. A 401 or 403 from the API is an error the user can read, not a blank page.",
        ],
      },
      {
        title: "Products on the dashboard",
        owner: "Member 2",
        summary:
          "Under the stat cards, list the same products in a table the seller can scan.",
        where: ["GET /api/products"],
        requirements: [
          "Columns: name, category, price, stock, status, featured. Status uses the existing Badge.",
          "Clicking a column header sorts that column in the browser. Do not send a new request just to sort.",
          "Highlight rows where stock is under 5.",
          "Share the fetch with Member 1’s page. One request fills both the cards and the table.",
          "An empty catalog shows the empty state from task 1, not an empty table with no explanation.",
        ],
      },
      {
        title: "Sellers land on their dashboard",
        owner: "Member 3",
        summary:
          "After login, and from the sidebar, a seller goes to /seller. Other roles cannot stay on that page.",
        where: ["app/login/page.tsx", "app/(portal)/layout.tsx"],
        requirements: [
          "Login currently sends every non-student to /dashboard. Send role seller to /seller. Students still go to /courses. Admin and instructor still go to /dashboard.",
          "The sidebar Dashboard link points to /seller when the signed-in user is a seller, and to /dashboard for admin and instructor.",
          "A seller does not see Users, Students, Courses, or Cart. Admin, instructor, and student who open /seller are redirected to their own home.",
          "Handle the API 403 as well as the redirect, in case someone calls the page before the redirect runs.",
        ],
      },
    ],
    stretch: [
      "A “Low stock” filter chip above the table.",
      "A link from each row to edit that product in the existing manage-products flow.",
    ],
  },
  {
    id: "group-b",
    name: "Group B",
    theme: "Who can open Manage Products",
    members: 3,
    brief:
      "Manage Products is in the sidebar for admin and seller, but the URL is still open. A student or instructor can type /manage-products and the page still renders. Close that gap. Hiding the link is not enough.",
    tasks: [
      {
        title: "Block the page for other roles",
        owner: "Member 1",
        summary:
          "Only admin and seller may see the product manager. Student and instructor get a clear refusal and no product data.",
        where: [
          "app/(portal)/manage-products/page.tsx",
          "components/manageProducts/index.tsx",
        ],
        requirements: [
          "Read the signed-in user from useAuth. If the role is not admin or seller, render a short message and a link back to that role’s home (student → /courses, instructor → /dashboard).",
          "Do not mount the product list, and do not call GET /api/products, for a role that is not allowed. The refusal must be visible before any product request.",
          "Admin and seller still see the current manager: list, add, edit, delete.",
          "Check it by pasting /manage-products into the address bar while logged in as student@example.com and as instructor@example.com.",
        ],
      },
      {
        title: "Require a session on the route",
        owner: "Member 2",
        summary:
          "A visitor who is not logged in can still open /manage-products, because that path is missing from the proxy matcher.",
        where: ["proxy.ts"],
        requirements: [
          "Add /manage-products to the matcher in proxy.ts so a request without a session cookie redirects to /login.",
          "Keep the public pages public. / , /tasks, /assignments, and /products-guide must still open with no cookie.",
          "After login, Member 1’s role check still applies. A student who logs in from that redirect must not land on the product manager.",
          "Confirm in the terminal log that a logged-out request to /manage-products is handled by proxy.ts.",
        ],
      },
      {
        title: "Navigation matches the rule",
        owner: "Member 3",
        summary:
          "The sidebar, and any other link to the manager, must follow the same rule as the page.",
        where: ["app/(portal)/layout.tsx"],
        requirements: [
          "Manage Products stays in the sidebar only for admin and seller. Student and instructor never see that item, including in the mobile menu.",
          "A seller does not gain links to Users, Students, or the admin dashboard from this task.",
          "The header title on /manage-products still says Manage Products for the roles who are allowed in.",
          "Write down, in the pull request, the four checks you ran: logged out, student, instructor, seller. Each one says where the user ended up.",
        ],
      },
    ],
    stretch: [
      "Remember the page the visitor wanted, and send admin or seller back to /manage-products after login.",
      "Same guard pattern extracted so /seller can reuse it.",
    ],
  },
  {
    id: "solo",
    name: "Solo student",
    theme: "The request that fires twice",
    members: 1,
    brief:
      "In the browser Network panel, one page load calls the same endpoint twice. This is an investigation. The deliverable is an explanation, and a code change only if you find a real extra request.",
    tasks: [
      {
        title: "Why does one endpoint get two requests?",
        owner: "You",
        summary:
          "Open the app with DevTools, reload once, and explain why the Network list shows two identical calls for a single endpoint.",
        where: [
          "components/manageProducts/index.tsx",
          "components/landingPage/AllProducts.tsx",
          "components/auth.tsx",
        ],
        requirements: [
          "Reproduce it on at least two screens. On /manage-products, watch GET /api/products. On the public home page, watch GET /api/public/products. Also note GET /api/auth/me when you enter the portal.",
          "Prove the pair is one user action. Filter the Network panel to Fetch/XHR, disable the cache, reload a single time, and compare the two calls (same URL, same method, initiator).",
          "Next.js runs React Strict Mode while you use npm run dev. Read what that does to useEffect, then say whether these pairs are that development behavior.",
          "Look for a second, real cause in this repo: an effect that sets state which is also in its dependency list, two components requesting the same URL, or a fetch that runs again because page or reload changed. The empty-page branch in the manage-products list is one place to check.",
          "Compare dev with production. Run npm run build and npm run start, reload the same page, and record whether the pair is still there.",
          "Hand in a short write-up in the pull request: which calls are doubled, the cause of each pair, and whether production does it too. Screenshots of the Network panel for dev and production belong in that write-up.",
          "Do not turn Strict Mode off to hide the pair. Change code only when you can show a request that is duplicated for a reason other than the development double invoke, and describe that fix in the same write-up.",
        ],
      },
    ],
    stretch: [
      "A one-page note, checked into the pull request, that tells the class how to tell a Strict Mode double call from a real bug.",
    ],
  },
];
