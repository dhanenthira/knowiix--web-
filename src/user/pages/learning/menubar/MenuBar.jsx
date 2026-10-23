import React, { useState } from 'react';
import {
  Home,
  BookOpen,
  Play,
  Bookmark,
  TrendingUp,
  History,
  ChevronLeft,
  ChevronRight,
  Layers
} from 'lucide-react';
import './MenuBar.css';

export default function MenuBar({
  activeTab = 'dashboard',
  setActiveTab,
  categoryFilter = 'all',
  setCategoryFilter,
  categories = [],
  allTutorialsCount = 0,
  continueCount = 0,
  savedCount = 0,
  user,
  isCollapsed = false,
  onToggleCollapse
}) {
  const [collapsed, setCollapsed] = useState(isCollapsed);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const toggleCollapse = () => {
    const nextState = !collapsed;
    setCollapsed(nextState);
    if (onToggleCollapse) onToggleCollapse(nextState);
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: Home,
      action: () => {
        setActiveTab('dashboard');
        if (setCategoryFilter) setCategoryFilter('all');
      }
    },
    {
      id: 'tutorials',
      label: 'Tutorials',
      icon: BookOpen,
      badge: allTutorialsCount > 0 ? allTutorialsCount : null,
      action: () => {
        setActiveTab('tutorials');
        if (setCategoryFilter) setCategoryFilter('all');
      }
    },
    {
      id: 'continue',
      label: 'In Progress',
      icon: Play,
      badge: continueCount > 0 ? continueCount : null,
      badgeActive: true,
      action: () => setActiveTab('continue')
    },
    {
      id: 'saved',
      label: 'Saved Notes',
      icon: Bookmark,
      badge: savedCount > 0 ? savedCount : null,
      action: () => setActiveTab('saved')
    },
    {
      id: 'progress',
      label: 'My Progress',
      icon: TrendingUp,
      action: () => setActiveTab('progress')
    },
    {
      id: 'history',
      label: 'Learning History',
      icon: History,
      action: () => setActiveTab('history')
    }
  ];

  return (
    <aside className={`oa-menubar-container ${collapsed ? 'collapsed' : 'expanded'}`}>
      <div className="oa-menubar-card">
        {/* TOP HEADER: TOGGLE COLLAPSE */}
        <div className="oa-menubar-header">
          <button
            type="button"
            className="oa-collapse-toggle-btn"
            onClick={toggleCollapse}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar collapse"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* NAVIGATION SECTIONS */}
        <div className="oa-menubar-nav-body">
          {/* MENU SECTION */}
          <div className="oa-menubar-section">
            <div className="oa-section-heading">
              {!collapsed ? 'MENU' : '•'}
            </div>

            <nav className="oa-nav-list" aria-label="Main menu">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`oa-nav-item ${isActive ? 'active' : ''}`}
                    onClick={item.action}
                    title={collapsed ? item.label : undefined}
                    id={`menubar-item-${item.id}`}
                  >
                    {/* Active Indicator Bar on the left */}
                    {isActive && <span className="oa-active-indicator" />}

                    <span className="oa-nav-icon-wrap">
                      <IconComponent size={18} />
                    </span>

                    {!collapsed && (
                      <span className="oa-nav-label">{item.label}</span>
                    )}

                    {!collapsed && item.badge && (
                      <span className={`oa-nav-badge ${item.badgeActive ? 'highlight' : ''}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Collapsible Categories Dropdown for Quick Access */}
              {categories && categories.length > 0 && !collapsed && (
                <div className="oa-categories-accordion">
                  <button
                    type="button"
                    className={`oa-nav-item ${categoriesOpen ? 'expanded-cat' : ''}`}
                    onClick={() => setCategoriesOpen(!categoriesOpen)}
                  >
                    <span className="oa-nav-icon-wrap">
                      <Layers size={18} />
                    </span>
                    <span className="oa-nav-label">Categories</span>
                    <span className="oa-nav-badge">{categories.length}</span>
                  </button>

                  {categoriesOpen && (
                    <div className="oa-categories-sublist">
                      {categories.map((cat) => {
                        const isCatActive = activeTab === 'tutorials' && categoryFilter === cat.slug;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            className={`oa-category-subitem ${isCatActive ? 'active' : ''}`}
                            onClick={() => {
                              if (setCategoryFilter) setCategoryFilter(cat.slug);
                              setActiveTab('tutorials');
                            }}
                            title={cat.name}
                          >
                            <span className="oa-cat-sub-name">{cat.name}</span>
                            <span className="oa-cat-sub-count">{cat.tutorial_count ?? 1}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>
    </aside>
  );
}
