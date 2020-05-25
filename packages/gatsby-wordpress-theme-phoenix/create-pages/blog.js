const { slash } = require( `gatsby-core-utils` );
const singlePageTemplate = require.resolve(`../src/templates/blog/index.js`);
const createPaginatedPages = require('gatsby-paginate');

// Get all the posts.
const GET_POSTS = `
query GET_POSTS {
  HWGraphQL {
	posts( first: 5000 ) {
	    edges {
	      node {
	        id
	        title
	        excerpt
	        content
	        date
	        uri
	        slug
	        featuredImage {
	          id
	          altText
	          sourceUrl
	          srcSet
	          sizes
	          mediaDetails {
	            width
	            height
	          }
	        }
	      }
	    }
	  }
  }
}
`;

module.exports = async ( { actions, graphql } ) => {

	const { createPage } = actions;

	const fetchPosts = async () => {

		// Do query to get all posts and posts, this will return the posts and posts.
		return await graphql( GET_POSTS )
			.then( ( { data } ) => {

				const { HWGraphQL: { posts } } = data;

				return { posts: posts.edges };
			} );
	};

	// When the above fetchPosts is resolved, then loop through the results i.e posts to create posts.
	await fetchPosts().then( ( { posts } ) => {

		createPaginatedPages({
			edges: posts,
			createPage: createPage,
			pageTemplate: singlePageTemplate,
			pageLength: 2, // This is optional and defaults to 10 if not used
			pathPrefix: 'blog', // This is optional and defaults to an empty string if not used
			context: {}, // This is optional and defaults to an empty object if not used
		})

		// 2. Create Single PAGE: Loop through all posts and create single posts for posts.
		posts &&
		posts.map( ( page ) => {

			createPage( {
				path: `blog${ page.uri }`,
				component: slash( singlePageTemplate ),
				context: { ...page }, // pass single post page data in context, so its available in the singlePagetTemplate in props.pageContext.
			} );

		} );

	} )

};