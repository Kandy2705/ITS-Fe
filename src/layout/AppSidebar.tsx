import { useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router";

// Assume these icons are imported from an icon library
import {
  HorizontaLDots,
  UserCircleIcon,
  ListIcon,
  FolderIcon,
  GroupIcon,
  PlusIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { useAppSelecteor } from "../hooks/useRedux";
import type { UserRole } from "../interfaces/user";
// import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
  role: UserRole;
};

// Define all menu items as flat structure
const allNavItems: NavItem[] = [
  // Admin items
  {
    name: "Quản lý người dùng",
    icon: <UserCircleIcon />,
    path: "/admin/users",
    role: "ADMIN",
  },
  {
    name: "Quản lý khóa học",
    icon: <ListIcon />,
    path: "/admin/courses",
    role: "ADMIN",
  },
  {
    name: "Danh sách lớp học",
    icon: <FolderIcon />,
    path: "/admin/courses/instances",
    role: "ADMIN",
  },
  {
    name: "Gán sinh viên vào lớp",
    icon: <GroupIcon />,
    path: "/admin/course-instances/enroll",
    role: "ADMIN",
  },
  {
    name: "Gán giáo viên",
    icon: <UserCircleIcon />,
    path: "/admin/assign-teacher",
    role: "ADMIN",
  },
  {
    name: "Tạo khoá học",
    icon: <PlusIcon />,
    path: "/admin/courses/new",
    role: "ADMIN",
  },
  // Teacher items
  {
    name: "Khóa học của tôi",
    icon: <FolderIcon />,
    path: "/teacher/courses",
    role: "TEACHER",
  },
  // Student items
  {
    name: "Khóa học của tôi",
    icon: <FolderIcon />,
    path: "/student/courses",
    role: "STUDENT",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  // Get user role from Redux
  const { userInfo } = useAppSelecteor((state) => state.auth) as {
    userInfo: { role?: string } | null;
  };

  const userRole = userInfo?.role?.toUpperCase() as UserRole | undefined;

  // Filter menu items based on user role
  const filteredNavItems = useMemo(() => {
    if (!userRole) return [];
    return allNavItems.filter((item) => item.role === userRole);
  }, [userRole]);

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav) => (
        <li key={nav.name}>
          <Link
            to={nav.path}
            className={`menu-item group ${
              isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
            }`}
          >
            <span
              className={`menu-item-icon-size ${
                isActive(nav.path)
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
              }`}
            >
              {nav.icon}
            </span>
            {(isExpanded || isHovered || isMobileOpen) && (
              <span className="menu-item-text">{nav.name}</span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <img
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(filteredNavItems)}
            </div>
            {/* <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div> */}
          </div>
        </nav>
        {/* {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null} */}
      </div>
    </aside>
  );
};

export default AppSidebar;
