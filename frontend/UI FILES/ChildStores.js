import { create } from 'zustand';
import brain from 'brain';
import { toast } from 'sonner';
import { ChildCreate, ChildUpdate, Child } from './childTypes';

interface ChildState {
  children: Child[];
  currentChild: Child | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchChildren: () => Promise<void>;
  fetchChild: (id: string) => Promise<void>;
  createChild: (child: ChildCreate) => Promise<string | null>;
  updateChild: (id: string, child: ChildUpdate) => Promise<boolean>;
  deleteChild: (id: string) => Promise<boolean>;
  setCurrentChild: (child: Child | null) => void;
}

const useChildStore = create<ChildState>((set, get) => ({
  children: [],
  currentChild: null,
  isLoading: false,
  error: null,
  
  fetchChildren: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await brain.get_all_children();
      const data = await response.json();
      set({ children: data, isLoading: false });
    } catch (error) {
      console.error('Error fetching children:', error);
      set({ error: 'Failed to fetch children', isLoading: false });
      toast.error('Failed to fetch children');
    }
  },
  
  fetchChild: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await brain.get_child({ child_id: id });
      const data = await response.json();
      set({ currentChild: data, isLoading: false });
    } catch (error) {
      console.error('Error fetching child:', error);
      set({ error: 'Failed to fetch child details', isLoading: false });
      toast.error('Failed to fetch child details');
    }
  },
  
  createChild: async (child: ChildCreate) => {
    set({ isLoading: true, error: null });
    try {
      const response = await brain.create_child(child);
      const data: Child = await response.json();
      set(state => ({ 
        children: [...state.children, data],
        currentChild: data,
        isLoading: false 
      }));
      toast.success('Child registered successfully');
      return data.id;
    } catch (error) {
      console.error('Error creating child:', error);
      set({ error: 'Failed to register child', isLoading: false });
      toast.error('Failed to register child');
      return null;
    }
  },
  
  updateChild: async (id: string, childUpdate: ChildUpdate) => {
    set({ isLoading: true, error: null });
    try {
      const response = await brain.update_child({ child_id: id }, childUpdate);
      const updatedChild: Child = await response.json();
      
      set(state => ({
        children: state.children.map(child => 
          child.id === id ? updatedChild : child
        ),
        currentChild: state.currentChild?.id === id ? updatedChild : state.currentChild,
        isLoading: false
      }));
      
      toast.success('Child information updated');
      return true;
    } catch (error) {
      console.error('Error updating child:', error);
      set({ error: 'Failed to update child information', isLoading: false });
      toast.error('Failed to update child information');
      return false;
    }
  },
  
  deleteChild: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await brain.delete_child({ child_id: id });
      
      set(state => ({
        children: state.children.filter(child => child.id !== id),
        currentChild: state.currentChild?.id === id ? null : state.currentChild,
        isLoading: false
      }));
      
      toast.success('Child record deleted');
      return true;
    } catch (error) {
      console.error('Error deleting child:', error);
      set({ error: 'Failed to delete child record', isLoading: false });
      toast.error('Failed to delete child record');
      return false;
    }
  },
  
  setCurrentChild: (child: Child | null) => {
    set({ currentChild: child });
  }
}));

export default useChildStore;
