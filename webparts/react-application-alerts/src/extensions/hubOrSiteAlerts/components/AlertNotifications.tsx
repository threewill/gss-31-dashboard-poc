import * as React from 'react';
import { IAlertNotificationsProps } from '.';
import * as strings from 'HubOrSiteAlertsApplicationCustomizerStrings';
import { MessageBar, MessageBarType } from '@fluentui/react/lib/MessageBar';
import { AlertType } from '../IAlert';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { IModalProps } from '@fluentui/react/lib/Modal';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { Icon } from '@fluentui/react/lib/Icon';
import { mergeStyles, mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';


export interface IAlertNotificationsState {
  hideDialog: boolean;
}

export class AlertNotifications extends React.Component<IAlertNotificationsProps, IAlertNotificationsState> {

  private dialogStyles = { main: { maxWidth: 450 } };

  private modalProps: IModalProps = {
    titleAriaId: 'dialogLabel',
    subtitleAriaId: 'subTextLabel',
    isBlocking: true,
    styles: this.dialogStyles,
  };

  
  private iconClass = mergeStyles({
    fontSize: 50,
    height: 50,
    width: 50,
  });

  private classNames = mergeStyleSets({
    gold: [{ color: 'gold' }, this.iconClass],
    limeGreen: [{ color: 'limegreen' }, this.iconClass],
    red: [{ color: 'red' }, this.iconClass],
  });

  constructor(props) {
    super(props);
    this.state = {
      hideDialog: false,
    };
  }

  public render(): React.ReactElement<IAlertNotificationsProps> {
    return (
      <div>
        {this.props.alerts.map(alert =>
        <div><MessageBar
          messageBarType={this.getMessageBarType(alert.type)}
          isMultiline={false}
        >
          {alert.message}
          {alert.moreInformationUrl ? <a href={alert.moreInformationUrl}>{strings.MoreInformation}</a> : ''}
        </MessageBar>
        <Dialog
          hidden={this.state.hideDialog}
          onDismiss={this.toggleHideDialog}
          modalProps={this.modalProps}
          dialogContentProps={{
            type: DialogType.normal,
            title: (<>
              {alert.type === AlertType.Information && <><Icon iconName="Info" className={this.classNames.gold} /></> }
              {alert.type === AlertType.Urgent && <><Icon iconName="Warning" className={this.classNames.red} /></> }
              {alert.type === AlertType.Resolved && <><Icon iconName="CheckMark" className={this.classNames.limeGreen} /></> }
            </>),
            closeButtonAriaLabel: 'Close',
            subText: `${alert.message} ${alert.moreInformationUrl ? <a href={alert.moreInformationUrl}>{strings.MoreInformation}</a> : ''}`,
          }}
          >
            <DialogFooter>
              <PrimaryButton onClick={this.toggleHideDialog} text="Dismiss" />
              {/* <DefaultButton onClick={this.toggleHideDialog} text="Don't send" /> */}
            </DialogFooter>
          </Dialog>
          </div>
        )}
      </div>
    );
  }

  private toggleHideDialog = () => {
    this.setState({
      hideDialog: !this.state.hideDialog
    });
  }

  private getMessageBarType = (alertType) => {
    switch (alertType) {
      case AlertType.Urgent: 
        return MessageBarType.severeWarning;
      case AlertType.Information:
        return MessageBarType.warning;
      case AlertType.Resolved:
        return MessageBarType.success;
    }
  }
}
