# Theme Implementation TODO

## 1. Enable Dark Mode in Tailwind Config
- [ ] Update tailwind.config.js to enable dark mode

## 2. Create Theme Context
- [ ] Create ThemeContext.jsx in src/contexts/
- [ ] Implement theme state management (light/dark)
- [ ] Add localStorage persistence
- [ ] Create ThemeProvider component

## 3. Update Main App Entry Point
- [ ] Wrap app with ThemeProvider in index.js

## 4. Add Theme Toggle Button
- [ ] Add toggle button to Nav.jsx component
- [ ] Import and use theme context
- [ ] Style toggle button appropriately

## 5. Update All Components to Use Theme-Aware Classes
- [ ] Update Nav.jsx - replace hardcoded dark classes with theme-aware classes
- [ ] Update Feed.jsx - replace hardcoded dark classes with theme-aware classes
- [ ] Update EditProject.jsx - replace hardcoded dark classes with theme-aware classes
- [ ] Update UserProfile.jsx - replace hardcoded dark classes with theme-aware classes
- [ ] Update header.jsx - replace hardcoded dark classes with theme-aware classes
- [ ] Update projectCard.jsx - replace hardcoded dark classes with theme-aware classes
- [ ] Update ProjectList.jsx - replace hardcoded dark classes with theme-aware classes
- [ ] Update Profile.jsx - replace hardcoded dark classes with theme-aware classes
- [ ] Update ProjectsList.jsx - replace hardcoded dark classes with theme-aware classes
- [ ] Update Friends.jsx - replace hardcoded dark classes with theme-aware classes
- [ ] Update CreateProject.jsx - replace hardcoded dark classes with theme-aware classes
- [ ] Update EditProfile.jsx - replace hardcoded dark classes with theme-aware classes
- [ ] Update searchBar.jsx - replace hardcoded dark classes with theme-aware classes

## 6. Test Theme Switching
- [ ] Test toggle functionality across different pages
- [ ] Ensure proper contrast and readability in both modes
- [ ] Verify localStorage persistence works correctly
