import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { 
  IPropertyPaneConfiguration, 
  PropertyPaneSlider,
  PropertyPaneCheckbox
} from '@microsoft/sp-property-pane';

import * as strings from 'PersonalCalendarWebPartStrings';
import { SpStarterKitSharedLibrary } from '@starter-kit/shared-library';
import PersonalCalendar from './components/PersonalCalendar';
import { IPersonalCalendarProps } from './components/IPersonalCalendarProps';
import { MSGraphClient } from '@microsoft/sp-http';

export interface IPersonalCalendarWebPartProps {
  title: string;
  refreshInterval: number;
  daysInAdvance: number;
  numMeetings: number;
  showCalendar: boolean;
}

export default class PersonalCalendarWebPart extends BaseClientSideWebPart<IPersonalCalendarWebPartProps> {
  private graphClient: MSGraphClient;
  private propertyFieldNumber;

  public onInit(): Promise<void> {
    return new Promise<void>((resolve: () => void, reject: (error: any) => void): void => {
      this.context.msGraphClientFactory
        .getClient()
        .then((client: MSGraphClient): void => {
          this.graphClient = client;
          resolve();
        }, err => reject(err));
    });
  }

  public render(): void {
    const element: React.ReactElement<IPersonalCalendarProps> = React.createElement(
      PersonalCalendar,
      {
        title: this.properties.title,
        refreshInterval: this.properties.refreshInterval,
        daysInAdvance: this.properties.daysInAdvance,
        numMeetings: this.properties.numMeetings,
        showCalendar: this.properties.showCalendar,
        // pass the current display mode to determine if the title should be
        // editable or not
        displayMode: this.displayMode,
        // pass the reference to the MSGraphClient
        graphClient: this.graphClient,
        // handle updated web part title
        updateProperty: (value: string): void => {
          // store the new title in the title web part property
          this.properties.title = value;
        }
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  //executes only before property pane is loaded.
  protected async loadPropertyPaneResources(): Promise<void> {
    // import additional controls/components

    const { PropertyFieldNumber } = await import(
      /* webpackChunkName: 'pnp-propcontrols-number' */
      '@pnp/spfx-property-controls/lib/propertyFields/number'
    );

    this.propertyFieldNumber = PropertyFieldNumber;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupFields: [
                this.propertyFieldNumber("refreshInterval", {
                  key: "refreshInterval",
                  // label: strings.RefreshInterval,
                  label: SpStarterKitSharedLibrary.getLocale('RefreshInterval'),
                  value: this.properties.refreshInterval,
                  minValue: 1,
                  maxValue: 60
                }),
                PropertyPaneSlider('daysInAdvance', {
                  label: strings.DaysInAdvance,
                  min: 0,
                  max: 7,
                  step: 1,
                  value: this.properties.daysInAdvance
                }),
                PropertyPaneSlider('numMeetings', {
                  label: strings.NumMeetings,
                  min: 0,
                  max: 20,
                  step: 1,
                  value: this.properties.numMeetings
                }),
                PropertyPaneCheckbox('showCalendar', {
                  text: strings.ShowCalendar,
                  checked: this.properties.showCalendar
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
