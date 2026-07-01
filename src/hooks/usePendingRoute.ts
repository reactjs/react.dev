/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

// App Router has no equivalent of router.events. Pending-state highlighting is
// dropped; <Link> still triggers transitions internally.
const usePendingRoute = (): string | null => null;

export default usePendingRoute;
