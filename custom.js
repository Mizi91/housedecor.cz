// // Redirects
// (function () {
//   // Pole s přesměrovacími pravidly. Můžete jich přidat více.
//   const redirectRules = [
//     {
//       // Pravidlo pro vaše kategorie
//       // Kontroluje, zda cesta začíná na /kategorie/ a má více než 2 segmenty
//       condition: function (pathParts) {
//         return pathParts[0] === 'kategorie' && pathParts.length > 2;
//       },
//       // Funkce, která sestaví novou URL
//       // Vezme poslední segment a připojí ho za /kategorie/
//       transform: function (pathParts) {
//         const lastSegment = pathParts[pathParts.length - 1];
//         return '/kategorie/' + lastSegment + '/';
//       }
//     },
//     // Zde můžete přidat další pravidla jako objekty
//     // Příklad dalšího pravidla:
//     // {
//     //     condition: function(pathParts) {
//     //         return pathParts[0] === 'stary-blog';
//     //     },
//     //     transform: function(pathParts) {
//     //         // Přesměruje /stary-blog/nazev-clanku na /magazin/nazev-clanku
//     //         const newPath = pathParts.slice(1).join('/');
//     //         return '/magazin/' + newPath;
//     //     }
//     // }
//   ];

//   // --- Logika skriptu (neměnit) ---
//   const currentPath = window.location.pathname;
//   const pathParts = currentPath.split('/').filter(part => part !== ''); // Rozdělí URL na segmenty a odstraní prázdné

//   for (const rule of redirectRules) {
//     if (rule.condition(pathParts)) {
//       const newUrl = rule.transform(pathParts);

//       // Kontrola, aby se nezacyklilo přesměrování
//       if (newUrl !== currentPath) {
//         // Použije replace(), aby se nová URL neukládala do historie prohlížeče
//         window.location.replace(newUrl);
//         return; // Zastaví vykonávání skriptu po nalezení prvního shodného pravidla
//       }
//     }
//   }
// })();


// Modify product cards layout and styles
document.addEventListener('DOMContentLoaded', function () {
  // Find all products containers
  const productsContainers = document.querySelectorAll('.products-block.products');
  productsContainers.forEach(productsContainer => {
    // Find all .product elements inside the container
    const allProducts = productsContainer.querySelectorAll('.product');

    allProducts.forEach(product => {
      // Move .p-bottom into .p-in-in
      const elementToMove = product.querySelector('.p-bottom');
      const destination = product.querySelector('.p-in-in');
      if (elementToMove && destination) {
        destination.appendChild(elementToMove);
      }

      // Change color for "vyprodáno" availability
      const availabilitySpan = product.querySelector('.ratings-wrapper .availability span');
      if (availabilitySpan && availabilitySpan.textContent.includes('vyprodáno')) {
        availabilitySpan.style.color = '#c12921';
      }
    });
  });
});

// Move payment methods from footer code to custom footer
document.addEventListener('DOMContentLoaded', function () {
  const footerToMove = document.querySelector('.footer-column--payments');
  const destination = document.querySelector('.custom-footer.elements-6');
  if (footerToMove && destination) {
    destination.appendChild(footerToMove);
  }

  const categoryTopTitle = document.querySelector('.type-category main#content .category-top > h4');
  if (categoryTopTitle) {
    categoryTopTitle.textContent = 'Naše tipy pro Vás';
  }
});


// Override the Shoptet menu splitting behavior to allow two rows
document.addEventListener('DOMContentLoaded', function () {
  // Wait for Shoptet to be fully loaded
  if (typeof shoptet !== 'undefined' && shoptet.menu) {
    // Store the original splitMenu function
    const originalSplitMenu = shoptet.menu.splitMenu;

    // Helper: mark first and second rows among currently visible (non-splitted) items
    function markMenuRows() {
      var $ul = $(".navigation-in .menu-level-1");
      var $all = $ul.children("li");
      var $visible = $ul.children("li:visible").not(".splitted");
      $all.removeClass("menu-row-1 menu-row-2");
      if (!$visible.length) return;
      var firstTop = $visible.first().position().top || 0;
      var tol = 3; // px tolerance for row detection
      $visible.each(function () {
        var $li = $(this);
        var top = $li.position().top || 0;
        if (Math.abs(top - firstTop) <= tol) {
          $li.addClass("menu-row-1");
        } else {
          // Any item below first row becomes row-2 (we only support two rows visually)
          $li.addClass("menu-row-2");
        }
      });
    }
    
    // Override with our custom version
    shoptet.menu.splitMenu = function() {
      var e = $(".menu-helper"),
          i = $(".navigation-in .menu-level-1 > li:visible"),
          n = e.length ? e.offset() : 0,
          s = [];
      
      // Remove fitted class and reset
      $("#navigation").removeClass("fitted");
      
      // Calculate positions for each menu item
      i.each(function () {
        var t = $(this),
            elemPos = t.outerWidth() + t.offset().left;
        t.removeClass("splitted");
        s.unshift({ $el: t, elemPos: elemPos });
      });
      
      // Responsive logic: Calculate items per row based on actual widths
      var menuContainer = $(".navigation-in .menu-level-1");
      var containerWidth = menuContainer.width();
      var helperMenuWidth = e.outerWidth() || 60; // Helper menu button width
      var availableWidth = containerWidth - helperMenuWidth - 20; // 20px buffer
      
      // Calculate how many items fit in one row
      var itemsPerRow = 0;
      var currentRowWidth = 0;
      
      // Go through items from right to left (as they appear in the s array)
      for (var t = s.length - 1; t >= 0; t--) {
        var itemWidth = s[t].$el.outerWidth(true); // Include margins
        if (currentRowWidth + itemWidth <= availableWidth) {
          currentRowWidth += itemWidth;
          itemsPerRow++;
        } else {
          break; // Stop when we can't fit more items
        }
      }
      
      // Allow double the items (two rows worth)
      var maxVisibleItems = itemsPerRow * 2;
      var totalItems = s.length;
      var itemsToSplit = Math.max(0, totalItems - maxVisibleItems);
      
      var splitCount = 0;
      // Split items from the beginning of the array
      for (var t = 0; t < itemsToSplit; t++) {
        s[t].$el.addClass("splitted");
        splitCount++;
      }
      
      // Update fitted class and helper menu
      if (splitCount === 0) {
        $("#navigation").addClass("fitted");
      }
      
      shoptet.menu.splitHelperMenu(i.length - splitCount);
      $("#navigation").addClass("visible");
      
      // After layout, tag first and second rows
      markMenuRows();
    };
    
    // Also add CSS to allow menu wrapping
    var style = document.createElement('style');
    style.textContent = `
      .navigation-in .menu-level-1 {
        flex-wrap: wrap !important;
        max-height: calc(2 * var(--menu-item-height, 50px)) !important;
        overflow: hidden !important;
      }
      
      .navigation-in .menu-level-1 > li {
        flex-shrink: 0 !important;
      }
    `;
    document.head.appendChild(style);
    
    // Trigger menu update if already loaded
    if (shoptet.menu.updateMenu) {
      shoptet.menu.updateMenu();
    }

    // Recalculate on resize/orientation change
    var _menuRowResizeTimer;
    $(window).on('resize orientationchange', function(){
      clearTimeout(_menuRowResizeTimer);
      _menuRowResizeTimer = setTimeout(function(){
        if (shoptet.menu.updateMenu) {
          shoptet.menu.updateMenu();
        } else if (shoptet.menu.splitMenu) {
          shoptet.menu.splitMenu();
        }
      }, 150);
    });
  } else {
    // If Shoptet isn't loaded yet, try again in a moment
    setTimeout(arguments.callee, 100);
  }
});
