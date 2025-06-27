@echo off
echo 🧹 Membersihkan file-file yang tidak diperlukan...
echo.

REM Hapus semua file .md kecuali README utama
echo 📄 Menghapus file dokumentasi .md...
del /q "ADMIN_STATUS.md" 2>nul
del /q "AVATAR_IMPLEMENTATION_COMPLETE.md" 2>nul
del /q "AVATAR_IMPROVEMENTS.md" 2>nul
del /q "AVATAR_ISSUE_ANALYSIS.md" 2>nul
del /q "AVATAR_TEST_GUIDE.md" 2>nul
del /q "AVATAR_TROUBLESHOOTING.md" 2>nul
del /q "CATEGORY_FIX_GUIDE.md" 2>nul
del /q "DATABASE_INTEGRATION_FIXED.md" 2>nul
del /q "DATABASE_SETUP_MYSQL.md" 2>nul
del /q "DEBUG_ADMIN.md" 2>nul
del /q "DEBUG_ADMINPANEL.md" 2>nul
del /q "FIX_ADMIN_DATA.md" 2>nul
del /q "IMAGE_LOAD_FIX.md" 2>nul
del /q "IMPLEMENTATION_COMPLETE.md" 2>nul
del /q "INSTALL.md" 2>nul
del /q "PROFILE_DEBUG.md" 2>nul
del /q "PROFILE_FIX_GUIDE.md" 2>nul
del /q "PROTECTED_ROUTES_IMPLEMENTATION.md" 2>nul
del /q "TAILWIND_MIGRATION.md" 2>nul
del /q "TUTORIAL_MYSQL_SETUP.md" 2>nul
del /q "UKM_CRUD_IMPLEMENTATION.md" 2>nul
del /q "UKM_DETAIL_REDESIGN_COMPLETE.md" 2>nul
del /q "UKM_SYSTEM_FINAL_STATUS.md" 2>nul
del /q "UPDATE_GABUNG_TO_DETAIL.md" 2>nul
del /q "UPDATE_UKM_DETAIL_REDESIGN.md" 2>nul
del /q "USER_MANAGEMENT_COMPLETED.md" 2>nul

REM Hapus file test dan debug di root
echo 🧪 Menghapus file test dan debug di root...
del /q "test_api.html" 2>nul
del /q "test_backend.py" 2>nul
del /q "test_everything.bat" 2>nul
del /q "verify_screenshot_match.py" 2>nul
del /q "debug-ukm-admin.html" 2>nul
del /q "image.png" 2>nul

REM Hapus utility files yang tidak diperlukan
echo ⚙️ Menghapus utility files yang tidak diperlukan...
del /q "setup_guide.py" 2>nul
del /q "setup_mysql.py" 2>nul
del /q "start_server.py" 2>nul
del /q "quick_setup.bat" 2>nul

REM Hapus folder UKMiverse yang tidak digunakan
echo 📁 Menghapus folder UKMiverse...
rmdir /s /q "UKMiverse" 2>nul

REM Hapus file testing di backend
echo 🔧 Menghapus file testing di backend...
cd backend
del /q "basic_test.py" 2>nul
del /q "comprehensive_avatar_test.py" 2>nul
del /q "check_admin_credentials.py" 2>nul
del /q "check_admin_data.py" 2>nul
del /q "check_backend.py" 2>nul
del /q "check_db_relations.py" 2>nul
del /q "check_simple.py" 2>nul
del /q "check_token.py" 2>nul
del /q "check_users.py" 2>nul
del /q "debug_api.html" 2>nul
del /q "debug_avatars.py" 2>nul
del /q "debug_categories.py" 2>nul
del /q "debug_final.py" 2>nul
del /q "debug_frontend_data.py" 2>nul
del /q "debug_image_load.py" 2>nul
del /q "debug_ukm_full.py" 2>nul
del /q "debug_ukm_response.py" 2>nul
del /q "debug_user_roles.py" 2>nul
del /q "test_api_response.py" 2>nul
del /q "test_auth_debug.py" 2>nul
del /q "test_avatar_api.py" 2>nul
del /q "test_avatar_display.py" 2>nul
del /q "test_avatar_fix.py" 2>nul
del /q "test_avatar_local.py" 2>nul
del /q "test_avatar_setup.py" 2>nul
del /q "test_avatar_upload.py" 2>nul
del /q "test_crud_ready.py" 2>nul
del /q "test_data_direct.py" 2>nul
del /q "test_db_simple.py" 2>nul
del /q "test_endpoints.py" 2>nul
del /q "test_full_system.py" 2>nul
del /q "test_login_response.py" 2>nul
del /q "test_password_update.py" 2>nul
del /q "test_profile.py" 2>nul
del /q "test_ukm_add.py" 2>nul
del /q "test_ukm_detail.py" 2>nul
del /q "test_ukm_detail_redesign.py" 2>nul
del /q "test_ukm_links.py" 2>nul
del /q "test_ukm_structure.py" 2>nul
del /q "test_users_endpoint.py" 2>nul
del /q "test_user_management.bat" 2>nul
del /q "verify_admin_system.py" 2>nul

REM Hapus utility files di backend yang tidak diperlukan
del /q "add_ukm_columns.py" 2>nul
del /q "get_admin_token.py" 2>nul
del /q "migrate_avatar_db.py" 2>nul
del /q "migrate_ukm_fields.py" 2>nul
del /q "migrate_ukm_simple.py" 2>nul
del /q "migrate_users.py" 2>nul
del /q "quick_fix_db.py" 2>nul
del /q "quick_start.py" 2>nul
del /q "quick_start_avatar.py" 2>nul
del /q "quick_test.py" 2>nul
del /q "quick_test_users.py" 2>nul
del /q "run_debug.py" 2>nul
del /q "simple_connection_test.py" 2>nul
del /q "simple_db_test.py" 2>nul
del /q "simple_fix.py" 2>nul
del /q "simple_test.py" 2>nul
del /q "start_debug_server.py" 2>nul
del /q "start_server.py" 2>nul
del /q "start_with_avatar.py" 2>nul

REM Hapus fix scripts yang sudah tidak diperlukan
del /q "comprehensive_fix.bat" 2>nul
del /q "debug_complete.bat" 2>nul
del /q "debug_display.bat" 2>nul
del /q "final_comprehensive_fix.py" 2>nul
del /q "final_fix.py" 2>nul
del /q "fix_admin_issues.bat" 2>nul
del /q "FIX_CATEGORIES.bat" 2>nul
del /q "fix_categories.py" 2>nul
del /q "fix_categories_final.bat" 2>nul
del /q "fix_category_ids.py" 2>nul
del /q "fix_db_direct.py" 2>nul
del /q "fix_db_relations.py" 2>nul
del /q "fix_ukm_categories_direct.py" 2>nul
del /q "start_backend_now.bat" 2>nul
del /q "test_data.bat" 2>nul

REM Hapus dokumentasi backend
del /q "AVATAR_SYSTEM_DOCS.md" 2>nul

cd..

REM Hapus file testing dan debug di frontend
echo 🎨 Menghapus file testing dan debug di frontend...
cd frontend
del /q "advanced-avatar-debug.html" 2>nul
del /q "avatar-debug-comprehensive.html" 2>nul
del /q "avatar-debug.html" 2>nul
del /q "avatar-diagnostic.html" 2>nul
del /q "avatar-fix-utility.js" 2>nul
del /q "avatar-fix-verification.html" 2>nul
del /q "avatar-issues-analysis.md" 2>nul
del /q "avatar-test.html" 2>nul
del /q "debug-auth.js" 2>nul
del /q "debug-profile.js" 2>nul
del /q "debug-url-loading.js" 2>nul
del /q "debug_adminpanel.html" 2>nul
del /q "final-avatar-test.html" 2>nul
del /q "image-test.html" 2>nul
del /q "simple-avatar-test.html" 2>nul
del /q "ukm-detail-redesign-preview.html" 2>nul
del /q "url-emergency-test.html" 2>nul

cd..

echo.
echo ✅ Pembersihan selesai!
echo.
echo 📊 File yang tersisa:
echo   📁 backend/
echo     - app/ (folder utama aplikasi)
echo     - config.py
echo     - requirements.txt
echo     - run.py
echo     - START_BACKEND.bat
echo     - QUICK_FIX.bat
echo.
echo   📁 frontend/
echo     - src/ (folder utama aplikasi)
echo     - public/
echo     - package.json
echo     - vite.config.js
echo     - tailwind.config.js
echo     - index.html
echo.
echo   📁 root/
echo     - README.md (file dokumentasi utama)
echo     - start_backend.bat
echo     - start_backend_manual.bat
echo     - QUICK_FIX.bat
echo.
echo 🎉 Project sudah bersih dan siap untuk production!
pause
