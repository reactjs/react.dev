/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails react-core
 */

'use strict';

import React, {Component} from 'react';

function ErrorBoundary(WrappedComponent) {
    return class extends Component{
        constructor(props, context) {
            super(props, context);

            this.state = {
                error: null,
            };
        }

        componentDidCatch(error) {
            this.setState({ error });
        }

        render() {
            console.log(this.state);
            if (this.state.error) {
                alert('Error, try to whitelist the site in AdBlocker/Cookie Whitelist');
                return;
            }
            return <WrappedComponent {...this.props} />;
        }
    }
}

export default ErrorBoundary;