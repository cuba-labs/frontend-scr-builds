import * as React from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { IReactionDisposer, reaction } from "mobx";

import { Modal, Button, List, Icon, message } from "antd";

import {
  collection,
  injectMainStore,
  MainStoreInjected
} from "@cuba-platform/react-core";
import {
  EntityProperty,
  Paging,
  setPagination,
  Spinner
} from "@cuba-platform/react-ui";

import { IntIdentityIdTestEntity } from "../../cuba/entities/scr_IntIdentityIdTestEntity";
import { SerializedEntity } from "@cuba-platform/rest";
import { IntIdentityIdMgtListManagement } from "./IntIdentityIdMgtListManagement";
import {
  FormattedMessage,
  injectIntl,
  WrappedComponentProps
} from "react-intl";
import { PaginationConfig } from "antd/es/pagination";

type Props = MainStoreInjected &
  WrappedComponentProps & {
    paginationConfig: PaginationConfig;
    onPagingChange: (current: number, pageSize: number) => void;
  };

@injectMainStore
@observer
class IntIdentityIdMgtListBrowseComponent extends React.Component<Props> {
  dataCollection = collection<IntIdentityIdTestEntity>(
    IntIdentityIdTestEntity.NAME,
    {
      view: "_local",
      sort: "-updateTs",
      loadImmediately: false
    }
  );

  reactionDisposers: IReactionDisposer[] = [];
  fields = ["description"];

  componentDidMount(): void {
    this.reactionDisposers.push(
      reaction(
        () => this.props.paginationConfig,
        paginationConfig =>
          setPagination(paginationConfig, this.dataCollection, true)
      )
    );
    setPagination(this.props.paginationConfig, this.dataCollection, true);

    this.reactionDisposers.push(
      reaction(
        () => this.dataCollection.status,
        status => {
          const { intl } = this.props;
          if (status === "ERROR") {
            message.error(intl.formatMessage({ id: "common.requestFailed" }));
          }
        }
      )
    );
  }

  componentWillUnmount() {
    this.reactionDisposers.forEach(dispose => dispose());
  }

  showDeletionDialog = (e: SerializedEntity<IntIdentityIdTestEntity>) => {
    Modal.confirm({
      title: this.props.intl.formatMessage(
        { id: "management.browser.delete.areYouSure" },
        { instanceName: e._instanceName }
      ),
      okText: this.props.intl.formatMessage({
        id: "management.browser.delete.ok"
      }),
      cancelText: this.props.intl.formatMessage({
        id: "management.browser.delete.cancel"
      }),
      onOk: () => {
        return this.dataCollection.delete(e);
      }
    });
  };

  render() {
    const { status, items, count } = this.dataCollection;
    const { paginationConfig, onPagingChange, mainStore } = this.props;

    if (status === "LOADING" || mainStore?.isEntityDataLoaded() !== true) {
      return <Spinner />;
    }

    return (
      <div className="narrow-layout">
        <div style={{ marginBottom: "12px" }}>
          <Link
            to={
              IntIdentityIdMgtListManagement.PATH +
              "/" +
              IntIdentityIdMgtListManagement.NEW_SUBPATH
            }
          >
            <Button htmlType="button" type="primary" icon="plus">
              <span>
                <FormattedMessage id="management.browser.create" />
              </span>
            </Button>
          </Link>
        </div>

        <List
          itemLayout="horizontal"
          bordered
          dataSource={items}
          renderItem={item => (
            <List.Item
              actions={[
                <Icon
                  type="delete"
                  key="delete"
                  onClick={() => this.showDeletionDialog(item)}
                />,
                <Link
                  to={IntIdentityIdMgtListManagement.PATH + "/" + item.id}
                  key="edit"
                >
                  <Icon type="edit" />
                </Link>
              ]}
            >
              <div style={{ flexGrow: 1 }}>
                {this.fields.map(p => (
                  <EntityProperty
                    entityName={IntIdentityIdTestEntity.NAME}
                    propertyName={p}
                    value={item[p]}
                    key={p}
                  />
                ))}
              </div>
            </List.Item>
          )}
        />

        {!this.props.paginationConfig.disabled && (
          <div style={{ margin: "12px 0 12px 0", float: "right" }}>
            <Paging
              paginationConfig={paginationConfig}
              onPagingChange={onPagingChange}
              total={count}
            />
          </div>
        )}
      </div>
    );
  }
}

const IntIdentityIdMgtListBrowse = injectIntl(
  IntIdentityIdMgtListBrowseComponent
);

export default IntIdentityIdMgtListBrowse;