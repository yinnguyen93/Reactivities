import { IActivity } from './../models/activity';
import { observable, action, computed, configure, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import agent from '../api/agent';

configure({ enforceActions: 'always' });

class ActivityStore {
  @observable activityRegisty = new Map();
  @observable activities: IActivity[] = [];
  @observable selectedActivity: IActivity | undefined;
  @observable loadingIntial = false;
  @observable editMode = false;
  @observable submitting = false;
  @observable target = '';

  @computed get activitiesByDate() {
    return Array.from(this.activityRegisty.values()).sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );
  }

  @action loadActivities = async () => {
    this.loadingIntial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction('loading activities', () => {
        activities.forEach((activity) => {
          activity.date = activity.date.split('.')[0];
          this.activityRegisty.set(activity.id, activity);
        });
        this.loadingIntial = false;
      });
    } catch (error) {
      runInAction('load activities error', () => {
        this.loadingIntial = false;
      });

      console.log(error);
    }
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction('creating activity', () => {
        this.activityRegisty.set(activity.id, activity);
        this.editMode = false;
        this.submitting = false;
      });
    } catch (error) {
      runInAction('create activity error', () => {
        this.submitting = false;
      });

      console.log(error);
    }
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction('editing activity', () => {
        this.activityRegisty.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.submitting = false;
      });
    } catch (error) {
      runInAction('edit activity error', () => {
        this.submitting = false;
      });

      console.log(error);
    }
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      runInAction('deleting activity', () => {
        this.activityRegisty.delete(id);
        this.submitting = false;
        this.target = 'delete activity error';
      });
    } catch (error) {
      runInAction('', () => {
        this.submitting = false;
        this.target = '';
      });

      console.log(error);
    }
  };

  @action openCreateForm = () => {
    this.editMode = true;
    this.selectedActivity = undefined;
  };

  @action openEditForm = (id: string) => {
    this.selectedActivity = this.activityRegisty.get(id);
    this.editMode = true;
  };

  @action cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  };

  @action cancelFormOpen = () => {
    this.editMode = false;
  };

  @action selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegisty.get(id);
    this.editMode = false;
  };
}

export default createContext(new ActivityStore());
