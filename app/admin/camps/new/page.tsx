import CampEditPage from '../[id]/edit/page';

// This route re-uses the edit page component to create a new camp.
// The `params.id` being "new" is handled by the logic inside CampEditPage.
export default function NewCampPage() {
  return <CampEditPage params={{ id: 'new' }} />;
}
