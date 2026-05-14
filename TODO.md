# TODO - Multi-image car uploads (URL + file) 

- [x] Step 1: Add server-side helper to upload image files to `public/cars/` and return public URLs.
- [ ] Step 2: Extend `app/admin/components/CarForm.tsx` UI to support:

  - [ ] Thumbnail image: either URL OR file upload (optional file input; keep URL working)
  - [ ] Additional gallery images: repeatable URL OR file upload
  - [ ] Simple position ordering: thumbnail = position 0, additional = 1..n
  - [ ] Keep existing fields and required behavior intact.
- [ ] Step 3: Update `app/actions/cars.ts`:
  - [ ] In `addCar`, keep current `imageUrl` behavior, and also create `CarImage` rows for uploaded/URL images.
  - [ ] In `updateCar`, append new gallery images by default; do not delete existing gallery.
- [ ] Step 4: Ensure public pages keep working:
  - [ ] Listing thumbnail uses `Car.images?.[0]?.url ?? car.imageUrl`.
  - [ ] Car detail carousel sorts by `CarImage.position`.
- [ ] Step 5: Run `npm run lint` and `npm run build` to verify.

