import { MainNav } from "./main-nav";
import { Search } from "./search";
import { UserNav } from "./user-nav";
export default function NavBar() {
    return (
        <div className="flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            {/* <TeamSwitcher /> */}
            <h1 className="text-2xl font-bold">Intekhaab</h1>
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <UserNav />
            </div>
          </div>
        </div>
      </div>
    );
}