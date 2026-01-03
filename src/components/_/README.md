# `components/_` folder {/*components_-folder*/}

This folder surves as a temporary location during transition from Next.js Pages Router to Next.js App Router. During this phase, many layout components may be shared bwetween both Next.js Pages Router and Next.js App Router.

Due to the requirements of the Next.js Pages Router, any components under this foldeer must either be shared components or client components. React Server Components are not allowed in this folder.

Once the migration to Next.js App Router is complete, this folder will be removed, and all components will be relocated to their appropriate locations.
