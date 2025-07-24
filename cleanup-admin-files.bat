:: Delete redundant admin files
rd /s /q app\admin\about
rd /s /q app\admin\announcement
rd /s /q app\admin\contact
rd /s /q app\admin\dashboard
rd /s /q app\admin\events
rd /s /q app\admin\process
rd /s /q app\admin\programs
rd /s /q app\admin\resources
rd /s /q app\admin\settings
del app\admin\layout.tsx
del app\admin\page.tsx
del app\admin\pydp.css

:: Delete redundant user files
rd /s /q app\user\about
rd /s /q app\user\announcement
rd /s /q app\user\events
rd /s /q app\user\process
rd /s /q app\user\programs
rd /s /q app\user\resources
del app\user\layout.tsx
del app\user\page.tsx

:: Delete redundant component files
del components\admin\Navbar.tsx
del components\user\Navbar.tsx
del components\user\announcement-list.tsx
