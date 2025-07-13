# How to Handle Rotation for Multi-Player Life Counter

## Problem Statement
We have an iPad placed flat on a table with players sitting around all edges. Each player needs to see their life total and controls oriented correctly from their viewing position. The challenge is that CSS transforms can create layout issues, especially with interactive elements.

## Physical Layout Analysis

### 5-Player "2-2-1" Configuration
```
    [Short Edge - Top]
         (no one)
    
[P1]  +-----------+  [P3]
[P2]  |   iPad    |  [P4]
      |  Screen   |
      +-----------+
         [P5]
    [Short Edge - Bottom]
```

- Players 1-2: Sitting on LEFT long edge, looking RIGHT
- Players 3-4: Sitting on RIGHT long edge, looking LEFT  
- Player 5: Sitting on BOTTOM short edge, looking UP

### Required Rotations
- P1, P2: Need 90° clockwise rotation (their "up" is screen's "right")
- P3, P4: Need 90° counter-clockwise rotation (their "up" is screen's "left")
- P5: No rotation needed (their "up" matches screen's "up")

## CSS Rotation Techniques

### 1. Transform Rotate (Current Approach)
```css
.rotate-90 { transform: rotate(90deg); }
.rotate--90 { transform: rotate(-90deg); }
```

**Problems:**
- Rotated elements maintain original layout space
- Click/touch targets can be offset
- Text selection becomes weird
- Overflow and scrolling behave unexpectedly

### 2. Writing Mode (Better for Text)
```css
.vertical-rl { 
  writing-mode: vertical-rl; /* Right to left */
  text-orientation: mixed;
}
.vertical-lr { 
  writing-mode: vertical-lr; /* Left to right */
}
```

**Benefits:**
- Native text flow in vertical direction
- Proper text selection
- Better for CJK languages

**Limitations:**
- Only works for 90° rotations
- Layout still thinks in terms of original orientation

### 3. Grid-Based Physical Rotation
Instead of rotating content, arrange the grid to match physical positions:

```css
/* For 2-2-1 layout */
.grid-2-2-1 {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: 1fr 1fr;
}

/* Player positions */
.p1 { grid-area: 1 / 1; } /* Top left */
.p2 { grid-area: 2 / 1; } /* Bottom left */
.p3 { grid-area: 1 / 3; } /* Top right */
.p4 { grid-area: 2 / 3; } /* Bottom right */
.p5 { grid-area: 2 / 2; } /* Bottom center */
```

### 4. Flexbox with Direction Control
```css
.player-card-vertical {
  display: flex;
  flex-direction: column;
  writing-mode: vertical-rl; /* or vertical-lr */
}
```

## Recommended Solution: Hybrid Approach

### 1. Layout Structure
- Use CSS Grid for positioning (no rotation needed)
- Each player gets their designated grid cell

### 2. Content Orientation
- Use `writing-mode` for text elements (life totals, names)
- Use `transform: rotate()` only for icons/buttons that need it
- Keep interactive elements in predictable positions

### 3. Component Architecture
```tsx
interface PlayerCardProps {
  orientation: 'top' | 'right' | 'bottom' | 'left';
  // ... other props
}

const PlayerCard = ({ orientation, ...props }) => {
  const getOrientationClasses = () => {
    switch(orientation) {
      case 'left': 
        return 'writing-mode-vertical-lr flex-row';
      case 'right': 
        return 'writing-mode-vertical-rl flex-row-reverse';
      case 'top': 
        return 'rotate-180';
      case 'bottom': 
      default:
        return '';
    }
  };
  
  // Render with appropriate classes
};
```

### 4. Touch/Click Handling
- For rotated elements, ensure click targets are where users expect
- Consider larger touch targets for rotated UI
- Test on actual device to verify touch accuracy

### 5. Specific Element Handling

#### Life Total Display
- Use large font size with `writing-mode` for vertical orientations
- No transform needed - native vertical text flow

#### Control Buttons (+1, -1, +5, -5)
- Arrange in a row/column based on orientation
- Use flexbox with appropriate `flex-direction`
- Keep buttons in intuitive positions relative to life total

#### Settings Button
- Position in the "top-right" corner relative to player's view
- This means different absolute positions based on orientation

#### Commander Damage
- Use a compact layout that works in any orientation
- Consider icons instead of text for space efficiency

## Implementation Steps

1. **Remove all transform-based rotations from PlayerCard**
2. **Add orientation prop to PlayerCard component**
3. **Implement writing-mode based text orientation**
4. **Create orientation-specific layouts using flexbox**
5. **Position settings button relative to player orientation**
6. **Test all interactive elements in each orientation**
7. **Optimize for touch targets and usability**

## Testing Checklist
- [ ] All text readable from player positions
- [ ] Buttons clickable without offset issues
- [ ] Settings modal appears in correct orientation
- [ ] Commander damage tracking works properly
- [ ] Life total editing works in all orientations
- [ ] No layout overflow or clipping issues
- [ ] Touch targets are appropriately sized

## Fallback Strategy
If writing-mode causes issues on some devices:
1. Use transform only on a wrapper div
2. Counter-rotate interactive elements
3. Adjust touch event coordinates manually
4. Consider using a canvas-based approach for complex layouts

## Current Implementation Status (as of latest test)

### Current Rendering Issues

The implementation using writing-mode CSS has revealed several issues:

1. **Text Orientation**: The life totals (40) are rendering vertically but not rotated correctly
2. **Button Layout**: Control buttons (-5, -1, +1, +5) are not following the expected layout
3. **Player Names**: "Player 1", "Player 2", etc. are rendering vertically but hard to read
4. **Grid Positioning**: Player 5 is in the center of the screen instead of bottom edge

### Expectation vs Reality Table

| Player Position | Expected Orientation | Expected Layout | Current Reality | Required Fix |
|----------------|---------------------|-----------------|-----------------|--------------|
| Player 1 (Left, Top) | Facing Right (→) | Vertical column, life total rotated 90° CW, buttons in vertical column | Text vertical but not rotated, buttons horizontal | Need to rotate text 90° within vertical writing mode |
| Player 2 (Left, Bottom) | Facing Right (→) | Vertical column, life total rotated 90° CW, buttons in vertical column | Same as Player 1 | Same as Player 1 |
| Player 3 (Right, Top) | Facing Left (←) | Vertical column, life total rotated 90° CCW, buttons in vertical column | Text vertical but facing wrong way, buttons horizontal | Need to rotate text -90° within vertical writing mode |
| Player 4 (Right, Bottom) | Facing Left (←) | Vertical column, life total rotated 90° CCW, buttons in vertical column | Same as Player 3 | Same as Player 3 |
| Player 5 (Bottom) | Facing Up (↑) | Horizontal layout, normal orientation | Currently in center of screen, normal orientation | Fix grid positioning to place at bottom edge |

### Root Causes

1. **Writing-mode alone is insufficient**: It changes text flow direction but doesn't rotate the glyphs themselves
2. **Grid positioning error**: Player 5 is using `col-start-2 row-start-2` which places it in the center
3. **Button layout not adapting**: Buttons remain in flex-row even when they should be flex-col
4. **Text needs additional rotation**: Within the vertical writing mode, individual characters need rotation

### Proposed Solution

1. **Combine writing-mode with text-orientation**:
   ```css
   .vertical-lr {
     writing-mode: vertical-lr;
     text-orientation: sideways-right; /* This rotates the text */
   }
   ```

2. **Fix grid layout for 2-2-1**:
   ```css
   grid-template-columns: 1fr 1fr 1fr;
   grid-template-rows: 1fr 1fr;
   /* Player 5 should span columns 2-3 on row 2 */
   ```

3. **Ensure button layouts follow orientation**:
   - Vertical players: buttons in column
   - Horizontal players: buttons in row

4. **Consider transform for specific elements**: 
   - Life total display may still need transform: rotate() for proper orientation
   - Buttons can use flexbox direction based on orientation