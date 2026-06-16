/**
 * Reusable Card component for displaying content blocks.
 *
 * Props:
 *  - title: Card heading
 *  - description: Card body text
 *  - image: Optional image URL
 *  - icon: Optional React node (e.g., SVG icon)
 *  - className: Additional custom classes
 *  - children: Optional custom content
 */

function Card({ title, description, image, icon, className = "", children }) {
  return (
    <div
      className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden ${className}`}
    >
      {image && (
        <div className="w-full h-48 overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="p-6">
        {icon && (
          <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary-100 text-primary-600 mb-4">
            {icon}
          </div>
        )}

        {title && (
          <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">
            {title}
          </h3>
        )}

        {description && (
          <p className="text-gray-600 leading-relaxed">{description}</p>
        )}

        {children}
      </div>
    </div>
  );
}

export default Card;
